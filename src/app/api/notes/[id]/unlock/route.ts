import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import argon2 from 'argon2';

export async function PUT(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {

    const { id } = await context.params;

    const body = await req.json();

    const password = body.password;

    if (!password) {
      return NextResponse.json(
        { error: 'Password required' },
        { status: 400 }
      );
    }

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (
      !note ||
      !note.passwordHash
    ) {
      return NextResponse.json(
        { error: 'Note not locked' },
        { status: 400 }
      );
    }

    const valid = await argon2.verify(
      note.passwordHash,
      password
    );

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    await prisma.note.update({
      where: { id },

      data: {
        isLocked: false,
        passwordHash: null,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { error: 'Failed to unlock note' },
      { status: 500 }
    );
  }
}