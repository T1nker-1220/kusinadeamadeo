import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// DELETE /api/products/[id]/variants/image
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

    const { searchParams } = new URL(req.url);
    const variantId = searchParams.get('variantId');

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }

    // Get variant with its current image URL
    const variant = await prisma.productVariant.findFirst({
      where: {
        id: variantId,
        productId: params.id
      },
      select: {
        id: true,
        imageUrl: true
      }
    });

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    if (!variant.imageUrl) {
      return NextResponse.json(
        { error: 'Variant has no image to delete' },
        { status: 400 }
      );
    }

    try {
      // Extract image path from URL
      const urlObj = new URL(variant.imageUrl);
      const pathMatch = urlObj.pathname.match(/\/images\/(.+)$/);
      const imagePath = pathMatch ? pathMatch[1] : null;

      if (!imagePath) {
        throw new Error('Invalid image path');
      }

      // Update database first
      await prisma.productVariant.update({
        where: { id: variantId },
        data: { imageUrl: null }
      });

      // Delete from Supabase storage
      const { error } = await supabase.storage
        .from('images')
        .remove([imagePath]);

      if (error) {
        // If storage deletion fails, try to rollback database update
        try {
          await prisma.productVariant.update({
            where: { id: variantId },
            data: { imageUrl: variant.imageUrl }
          });
        } catch (rollbackError) {
          console.error('Failed to rollback database update:', rollbackError);
        }
        throw error;
      }

      // Get updated variant data
      const updatedVariant = await prisma.productVariant.findUnique({
        where: { id: variantId }
      });

      return NextResponse.json({
        message: 'Image deleted successfully',
        variant: updatedVariant
      });
    } catch (error) {
      console.error('Error during image deletion:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting variant image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete variant image' },
      { status: 500 }
    );
  }
}
