import { prisma } from '@/lib/prisma';
import { StorageCleanupService } from '@/lib/services/storage-cleanup';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// POST /api/storage/cleanup
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
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Run cleanup
    await StorageCleanupService.cleanupOrphanedImages();

    return NextResponse.json({
      message: 'Storage cleanup completed successfully'
    });
  } catch (error) {
    console.error('Error during storage cleanup:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup storage' },
      { status: 500 }
    );
  }
}
