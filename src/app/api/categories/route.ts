import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Category validation schema
const categorySchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be less than 200 characters"),
  imageUrl: z.string().url("Invalid image URL"),
  sortOrder: z.number().int("Sort order must be an integer").min(1, "Sort order must be at least 1")
});

// Error handler utility
const handleError = (error: unknown) => {
  console.error('API Error:', error);
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    );
  }
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
};

// GET /api/categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    return NextResponse.json(categories);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/categories
export async function POST(req: Request) {
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
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = categorySchema.parse(body);

    // Check for duplicate names
    const existingCategory = await prisma.category.findFirst({
      where: { name: validatedData.name }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      );
    }

    // Check for sort order conflicts
    const existingOrder = await prisma.category.findFirst({
      where: { sortOrder: validatedData.sortOrder }
    });

    if (existingOrder) {
      // Auto-adjust sort orders to make space
      await prisma.category.updateMany({
        where: {
          sortOrder: {
            gte: validatedData.sortOrder
          }
        },
        data: {
          sortOrder: {
            increment: 1
          }
        }
      });
    }

    // Create category
    const category = await prisma.category.create({
      data: validatedData
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

// PATCH /api/categories
export async function PATCH(req: Request) {
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
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, sortOrder } = body;

    if (!id || typeof sortOrder !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Update sort order with transaction to handle conflicts
    const updatedCategory = await prisma.$transaction(async (tx) => {
      // Move other categories if necessary
      await tx.category.updateMany({
        where: {
          id: { not: id },
          sortOrder: sortOrder
        },
        data: {
          sortOrder: category.sortOrder
        }
      });

      // Update target category
      return tx.category.update({
        where: { id },
        data: { sortOrder }
      });
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/categories
export async function DELETE(req: Request) {
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
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Delete category and reorder remaining categories
    await prisma.$transaction(async (tx) => {
      // Delete the category
      await tx.category.delete({
        where: { id }
      });

      // Update sort orders for remaining categories
      await tx.category.updateMany({
        where: {
          sortOrder: {
            gt: category.sortOrder
          }
        },
        data: {
          sortOrder: {
            decrement: 1
          }
        }
      });
    });

    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
