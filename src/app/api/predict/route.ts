import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { predictQuestions } from '@/utils/questionPredictor';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get('subject');

  try {
    const questions = await prisma.question.findMany({
      where: {
        ...(subject ? { subject } : {}),
      }
    });

    if (questions.length === 0) {
      return NextResponse.json([]);
    }

    const predictions = predictQuestions(questions);
    return NextResponse.json(predictions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to predict questions' }, { status: 500 });
  }
}
