import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs/promises';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get('subject');
  const module = searchParams.get('module');

  try {
    const notes = await (prisma as any).notes.findMany({
      where: {
        ...(subject ? { subject } : {}),
        ...(module ? { module: parseInt(module) } : {}),
      }
    });
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const subject = formData.get('subject') as string;
    const moduleValue = parseInt(formData.get('module') as string);
    const title = formData.get('title') as string || `Module ${moduleValue} Notes`;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'notes');
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Add timestamp to filename to avoid collisions
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const note = await (prisma as any).notes.create({
      data: {
        title,
        fileUrl: `/uploads/notes/${fileName}`,
        module: moduleValue,
        subject,
      }
    });

    // Create Notification
    await (prisma as any).notification.create({
      data: {
        title: 'New Study Notes Added',
        message: `Admin uploaded new notes: ${title} for ${subject} (Module ${moduleValue})`,
        type: 'NOTES'
      }
    });

    return NextResponse.json({ message: 'Note uploaded successfully', note });

  } catch (error: any) {
    console.error('Note upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const note = await (prisma as any).notes.findUnique({ where: { id } });
    if (note) {
      const filePath = path.join(process.cwd(), 'public', note.fileUrl);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Could not delete file:', err);
      }
    }

    await (prisma as any).notes.delete({ where: { id } });
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title } = await req.json();
    if (!id || !title) return NextResponse.json({ error: 'ID and title are required' }, { status: 400 });

    const updated = await (prisma as any).notes.update({
      where: { id },
      data: { title }
    });

    return NextResponse.json({ message: 'Note updated successfully', note: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

