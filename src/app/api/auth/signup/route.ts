import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { username, password, role } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const existingUser = await (prisma as any).user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 409 });
    }

    const newUser = await (prisma as any).user.create({
      data: {
        username,
        password, // In a production app, password should be hashed
        role: role === 'ADMIN' ? 'ADMIN' : 'STUDENT'
      }
    });

    return NextResponse.json({ message: 'Account created successfully', userId: newUser.id });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
