import prisma from '@/lib/prisma';

// ✅ GET all model papers
export async function GET() {
  try {
    const papers = await prisma.modelPaper.findMany({
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    return Response.json(papers);
  } catch (error) {
    console.error("GET ERROR:", error);
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ✅ POST new model paper
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, subject, semester, scheme, fileUrl } = body;

    if (!title || !subject || !semester || !scheme || !fileUrl) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const newPaper = await prisma.modelPaper.create({
      data: {
        title,
        subject,
        semester: Number(semester),
        scheme,
        fileUrl,
        uploadedAt: new Date(),
      },
    });

    return Response.json(newPaper);
  } catch (error: any) {
    console.error("POST ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}