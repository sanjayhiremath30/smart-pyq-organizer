import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const semester = searchParams.get('semester');
  const scheme = searchParams.get('scheme');

  try {
    const subjects = await prisma.subject.findMany({
      where: {
        ...(semester ? { semester: parseInt(semester) } : {}),
        ...(scheme ? { scheme } : {}),
      }
    });
    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}
