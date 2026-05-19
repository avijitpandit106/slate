import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  req: Request,
  context: {
    params: Promise<{ id: string }>
  }
) {

  try {

    const { id } =
      await context.params;

    await prisma.note.update({
      where: { id },

      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { error: 'Restore failed' },
      { status: 500 }
    );
  }
}