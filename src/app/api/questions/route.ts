import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get('subject');
  const moduleParam = searchParams.get('module');

  try {
    const questions = await prisma.question.findMany({
      where: {
        ...(subject ? { subject } : {}),
        ...(moduleParam ? { module: parseInt(moduleParam) } : {}),
      },
      orderBy: { frequency: 'desc' }
    });

    const videos = await prisma.youtubeVideo.findMany({
      where: {
        ...(subject ? { subject } : {}),
      }
    });

    const enrichedQuestions = questions.map((q: any) => ({
      ...q,
      relatedVideo: videos.find((v: any) => v.topic === q.topic)?.link || null
    }));

    return NextResponse.json(enrichedQuestions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
