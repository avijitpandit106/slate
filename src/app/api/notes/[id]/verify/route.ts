import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import argon2 from 'argon2';

export async function POST(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();

    const password = body.password;

    if (!password || password.trim() === '') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const note = await prisma.note.findUnique({
      where: { id },
      select: {
        passwordHash: true,
      },
    });

    if (!note || !note.passwordHash) {
      return NextResponse.json(
        { error: 'Note is not locked' },
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

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error('VERIFY ERROR:', err);

    return NextResponse.json(
      { error: 'Failed to verify password' },
      { status: 500 }
    );
  }
}