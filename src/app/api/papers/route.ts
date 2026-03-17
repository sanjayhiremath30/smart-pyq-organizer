import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs/promises';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const semester = searchParams.get('semester');

    const papers = await (prisma as any).pYQPaper.findMany({
      where: {
        ...(subject ? { subject } : {}),
        ...(semester ? { semester: parseInt(semester) } : {}),
      },
      orderBy: { uploadedAt: 'desc' },
    });
    return NextResponse.json(papers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch papers' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const paper = await (prisma as any).pYQPaper.findUnique({ where: { id } });
    if (paper) {
      const filePath = path.join(process.cwd(), 'public', paper.filePath);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Could not delete file:', err);
      }
    }

    await (prisma as any).pYQPaper.delete({ where: { id } });
    return NextResponse.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
}
