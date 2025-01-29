import { prisma } from '@/lib/prisma';
import { ProductImageService } from '@/lib/services/product-image';
import { ProductVariantSchema } from '@/lib/validations/product';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// GET /api/products/[id]/variants
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { productId: params.id },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(variants);
  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variants' },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/variants
export async function POST(
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

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const body = await req.json();

    // Validate request body
    const validatedData = ProductVariantSchema.parse({
      ...body,
      stock: body.stock || 0,
      isAvailable: body.isAvailable ?? true,
    });

    // Create variant
    const variant = await prisma.productVariant.create({
      data: {
        ...validatedData,
        productId: params.id
      }
    });

    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating variant:', error);
    return NextResponse.json(
      { error: 'Failed to create variant' },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id]/variants
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

    const { searchParams } = new URL(req.url);
    const variantId = searchParams.get('variantId');
    const body = await req.json();

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }

    // Validate update data
    const validatedData = ProductVariantSchema.partial().parse(body);

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

    // If imageUrl is being updated and old image exists, prepare for cleanup
    if ('imageUrl' in validatedData && existingVariant.imageUrl && existingVariant.imageUrl !== validatedData.imageUrl) {
      const imagePath = ProductImageService.getImagePath(existingVariant.imageUrl);
      if (imagePath) {
        try {
          await ProductImageService.deleteVariantImage(imagePath);
        } catch (error) {
          console.error('Error deleting old variant image:', error);
          // Continue with the update even if image deletion fails
        }
      }
    }

    // Update variant
    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: validatedData
    });

    return NextResponse.json({
      message: 'Variant updated successfully',
      variant
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating variant:', error);
    return NextResponse.json(
      { error: 'Failed to update variant' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]/variants
export async function DELETE(
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

    const { searchParams } = new URL(req.url);
    const variantId = searchParams.get('variantId');

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }

    // Check if variant exists and belongs to the product
    const variant = await prisma.productVariant.findFirst({
      where: {
        id: variantId,
        productId: params.id
      },
      include: { orderItems: true }
    });

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    // Don't allow deletion if variant has order items
    if (variant.orderItems.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete variant with existing orders' },
        { status: 400 }
      );
    }

    // Start a transaction to handle both database and storage operations
    try {
      // Delete variant from database first
      await prisma.productVariant.delete({
        where: { id: variantId }
      });

      // If variant has an image, delete it from storage
      if (variant.imageUrl) {
        try {
          // Extract image path from URL
          const urlObj = new URL(variant.imageUrl);
          const pathMatch = urlObj.pathname.match(/\/images\/(.+)$/);
          const imagePath = pathMatch ? pathMatch[1] : null;

          if (imagePath) {
            // Delete from Supabase storage
            const { error: storageError } = await supabase.storage
              .from('images')
              .remove([imagePath]);

            if (storageError) {
              console.error('Error deleting image from storage:', storageError);
              // Log the error but don't throw since the variant is already deleted
              // We can handle orphaned images with a cleanup job later
            }
          }
        } catch (imageError) {
          console.error('Error processing image deletion:', imageError);
          // Log the error but continue since the variant is already deleted
        }
      }

      return NextResponse.json({
        message: 'Variant deleted successfully'
      });
    } catch (error) {
      console.error('Error during variant deletion transaction:', error);
      throw error; // Re-throw to be caught by outer try-catch
    }
  } catch (error) {
    console.error('Error deleting variant:', error);
    return NextResponse.json(
      { error: 'Failed to delete variant' },
      { status: 500 }
    );
  }
}
