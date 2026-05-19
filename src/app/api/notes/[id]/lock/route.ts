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

    if (!password || password.trim() === '') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const hash = await argon2.hash(password);

    await prisma.note.update({
      where: { id },
      data: {
        isLocked: true,
        passwordHash: hash,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error('LOCK ERROR:', err);

    return NextResponse.json(
      { error: 'Failed to lock note' },
      { status: 500 }
    );
  }
}