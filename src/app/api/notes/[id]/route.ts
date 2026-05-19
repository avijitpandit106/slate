import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { extractText } from '@/lib/extract-text';
import { z } from 'zod';

const noteSchema = z
  .object({
    title: z.string().optional(),
    content: z.any().optional(),
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

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    await prisma.note.update({
      where: { id },

      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE ERROR:', err);

    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const body = await req.json();

    const parsed = noteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await prisma.note.update({
      where: { id },
      data: {
        title: parsed.data.title ?? null,
      
        content: parsed.data.content ?? null,
      
        contentText:
          parsed.data.content
            ? extractText(parsed.data.content)
            : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('UPDATE ERROR:', err);

    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 },
    );
  }
}
