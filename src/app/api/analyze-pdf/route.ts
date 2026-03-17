import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzePDF } from '@/utils/pdfAnalyzer';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const subjectName = formData.get('subjectName') as string;
    const semesterValue = parseInt(formData.get('semester') as string);
    const schemeValue = formData.get('scheme') as string;
    const moduleValue = parseInt(formData.get('module') as string) || 1;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'papers');
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);

    let subject = await prisma.subject.findFirst({
      where: { name: subjectName, semester: semesterValue, scheme: schemeValue }
    });

    if (!subject) {
      subject = await prisma.subject.create({
        data: { name: subjectName, semester: semesterValue, scheme: schemeValue }
      });
    }

    // Call locally processed analyzer
    const { questions: analyzedQuestions, report: analysisReport } = await analyzePDF(buffer);

    const pyqPaper = await (prisma as any).pYQPaper.create({
      data: {
        fileName: file.name,
        filePath: `/uploads/papers/${file.name}`,
        subject: subjectName,
        semester: semesterValue,
        subjectId: subject.id,
        analysisReport: analysisReport
      }
    });

    const note = await (prisma as any).notes.create({
      data: {
        title: `Extracted Notes: ${file.name}`,
        description: `Auto-generated notes from uploaded PDF logic.`,
        fileUrl: `/uploads/papers/${file.name}`,
        module: moduleValue,
        subject: subjectName,
        semester: semesterValue,
      }
    });

    for (const q of analyzedQuestions) {
      const existing = await prisma.question.findFirst({
        where: { question: q.question, subject: subjectName }
      });

      if (existing) {
        const newFreq = (existing as any).frequency + 1;
        await prisma.question.update({
          where: { id: existing.id },
          data: { 
            frequency: newFreq,
            label: newFreq > 5 ? 'Most repeated' : (newFreq > 2 ? 'Frequently asked' : 'Rare question')
          } as any
        });
      } else {
        await (prisma as any).question.create({
          data: {
            question: q.question,
            answer: q.answer,
            marks: q.marks,
            topic: q.topic as string,
            label: q.label as string,
            subject: subjectName,
            semester: semesterValue,
            scheme: schemeValue,
            module: q.module || 1,
            frequency: 1
          }
        });

        // Auto-generation of YouTube videos removed as per user request
      }
    }

    // Create Notification
    await (prisma as any).notification.create({
      data: {
        title: 'New PYQ Paper Analyzed',
        message: `Admin uploaded and analyzed a PYQ Paper for ${subjectName} (Semester ${semesterValue})`,
        type: 'PYQ_PAPER'
      }
    });

    return NextResponse.json({ 
      message: 'Analysis complete', 
      questionsFound: analyzedQuestions.length,
      paperId: pyqPaper.id,
      questions: analyzedQuestions,
      report: analysisReport
    });

  } catch (error: any) {
    console.error('Analysis error stack:', error.stack || error);
    return NextResponse.json({ error: error.stack || error.message || String(error) }, { status: 500 });
  }
}
