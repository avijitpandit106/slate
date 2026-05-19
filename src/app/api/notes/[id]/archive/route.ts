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

    const note =
      await prisma.note.findUnique({
        where: { id },
      });

    if (!note) {

      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    await prisma.note.update({
      where: { id },

      data: {
        isArchived:
          !note.isArchived,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { error: 'Archive failed' },
      { status: 500 }
    );
  }
}