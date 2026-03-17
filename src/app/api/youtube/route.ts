import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');

    const videos = await (prisma as any).youtubeVideo.findMany({
      where: {
        ...(subject ? { subject } : {})
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, link, subject, module, semester, scheme, topic, channelName, thumbnailUrl } = body;

    if (!title || !link || !subject) {
      return NextResponse.json({ error: 'Title, link, and subject are required' }, { status: 400 });
    }

    const video = await (prisma as any).youtubeVideo.create({
      data: {
        title,
        link,
        subject,
        module: module ? parseInt(module) : null,
        semester: semester ? parseInt(semester) : null,
        scheme,
        topic,
        channelName,
        thumbnailUrl
      }
    });

    // Create Notification
    await (prisma as any).notification.create({
      data: {
        title: 'New Video Lecture Added',
        message: `Admin added a new video: ${title} for ${subject}`,
        type: 'VIDEO'
      }
    });

    return NextResponse.json({ message: 'Video added successfully', video });
  } catch (error: any) {
    console.error('Video upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await (prisma as any).youtubeVideo.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}