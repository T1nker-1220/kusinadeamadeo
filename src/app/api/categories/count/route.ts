import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const count = await db.category.count();

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Failed to get category count:', error);
    return NextResponse.json(
      { error: 'Failed to get category count' },
      { status: 500 }
    );
  }
}
