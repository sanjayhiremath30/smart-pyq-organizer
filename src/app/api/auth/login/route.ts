import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { username, password, role } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const user = await (prisma as any).user.findUnique({ where: { username } });
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials. Please verify your username and password.' }, { status: 401 });
    }

    if (role && user.role !== role) {
      return NextResponse.json({ error: `Verification failed. Account is not registered as an ${role}.` }, { status: 403 });
    }

    return NextResponse.json({ message: 'Login successful', userId: user.id, role: user.role });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}
