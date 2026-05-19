import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { extractText } from '@/lib/extract-text';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const noteSchema = z
  .object({
    title: z.string().optional(),
    content: z.unknown().optional(),
  })
  .refine(
    data => {
      const hasTitle = data.title && data.title.trim() !== '';

      const hasContent =
        data.content &&
        typeof data.content === 'object' &&
        'content' in data.content &&
        Array.isArray(data.content.content) &&
        data.content.content.length > 0;

      return hasTitle || hasContent;
    },
    {
      message: 'Note cannot be empty',
    },
  );

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        updatedAt: 'desc',
      },

      select: {
        id: true,
        title: true,
        content: true,
        contentText: true,

        isLocked: true,
        isArchived: true,
        isDeleted: true,

        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(notes);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        title: parsed.data.title ?? null,
        content: parsed.data.content ?? Prisma.JsonNull,
        contentText: parsed.data.content
          ? extractText(parsed.data.content)
          : null,
      },
    });

    return NextResponse.json(note);
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON or server error' },
      { status: 400 },
    );
  }
}
