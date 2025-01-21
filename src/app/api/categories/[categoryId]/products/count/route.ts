import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

interface RouteParams {
  params: {
    categoryId: string;
  };
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { categoryId } = params;

    // Verify category exists
    const category = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Get product count for the category
    const count = await db.product.count({
      where: { categoryId },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Failed to get product count:', error);
    return NextResponse.json(
      { error: 'Failed to get product count' },
      { status: 500 }
    );
  }
}
