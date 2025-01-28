import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const stockUpdateSchema = z.object({
  variantId: z.string().uuid(),
  stock: z.number().int().min(0),
});

// PATCH /api/products/[id]/variants/stock
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin role
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user role from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validate request body
    const { variantId, stock } = stockUpdateSchema.parse(body);

    // Check if variant exists and belongs to the product
    const existingVariant = await prisma.productVariant.findFirst({
      where: {
        id: variantId,
        productId: params.id
      }
    });

    if (!existingVariant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    // Update variant stock
    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock }
    });

    return NextResponse.json(variant);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating variant stock:', error);
    return NextResponse.json(
      { error: 'Failed to update variant stock' },
      { status: 500 }
    );
  }
}
