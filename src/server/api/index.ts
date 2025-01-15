import type { Database } from '@/types/database';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Create a typed Supabase client for server components
export function createServerClient() {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
}

// Error handling utility
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Response utilities
export function successResponse<T>(data: T) {
  return {
    success: true,
    data,
  };
}

export function errorResponse(error: Error | ApiError) {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  return {
    success: false,
    error: error.message,
    statusCode: 500,
  };
}

// Validation utilities
export function validateBusinessHours() {
  const now = new Date();
  const hours = now.getHours();
  const openingHour = parseInt(process.env.NEXT_PUBLIC_ORDER_HOURS_START?.split(':')[0] ?? '8');
  const closingHour = parseInt(process.env.NEXT_PUBLIC_ORDER_HOURS_END?.split(':')[0] ?? '22');

  if (hours < openingHour || hours >= closingHour) {
    throw new ApiError(
      400,
      'Orders can only be placed during business hours (8:00 AM - 10:00 PM)',
      'OUTSIDE_BUSINESS_HOURS'
    );
  }
}

// Rate limiting utility
export async function checkRateLimit(userId: string, action: string) {
  const supabase = createServerClient();
  const now = new Date();
  const windowMinutes = 15;

  const { data: rateLimit } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('userId', userId)
    .eq('action', action)
    .single();

  if (rateLimit) {
    const windowStart = new Date(rateLimit.lastReset);
    const minutesSinceReset = (now.getTime() - windowStart.getTime()) / 1000 / 60;

    if (minutesSinceReset < windowMinutes && rateLimit.count >= 100) {
      throw new ApiError(429, 'Rate limit exceeded', 'RATE_LIMIT_EXCEEDED');
    }

    if (minutesSinceReset >= windowMinutes) {
      await supabase
        .from('rate_limits')
        .update({ count: 1, lastReset: now.toISOString() })
        .eq('id', rateLimit.id);
    } else {
      await supabase
        .from('rate_limits')
        .update({ count: rateLimit.count + 1 })
        .eq('id', rateLimit.id);
    }
  } else {
    await supabase.from('rate_limits').insert({
      userId,
      action,
      count: 1,
      lastReset: now.toISOString(),
    });
  }
}
