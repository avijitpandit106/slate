import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const RETENTION_DAYS = 7;

export async function GET() {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

    const { count } = await prisma.note.deleteMany({
      where: {
        isDeleted: true,
        deletedAt: { lte: cutoff },
      },
    });

    return NextResponse.json({ success: true, deleted: count });
  } catch (err) {
    console.error('CLEANUP ERROR:', err);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
