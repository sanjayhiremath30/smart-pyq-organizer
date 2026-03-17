const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.favourite.deleteMany({});
  await prisma.youtubeVideo.deleteMany({});
  await prisma.notes.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.pYQPaper.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed Users
  await prisma.user.create({ data: { username: 'student', password: 'password', role: 'STUDENT' } });
  await prisma.user.create({ data: { username: 'admin', password: 'admin', role: 'ADMIN' } });

  // Seed Subjects for Semester 6
  const sem6Subjects = [
    'Compiler Design',
    'IEFT',
    'Comprehensive',
    'CGIP',
    'AAD',
    'DCC'
  ];

  for (const name of sem6Subjects) {
    await prisma.subject.create({
      data: {
        name,
        semester: 6,
        scheme: '2019'
      }
    });
  }

  // Seed Questions
  await prisma.question.createMany({
    data: [
      { question: 'Explain the phases of a compiler.', answer: 'Phases: Lexical, Syntax, Semantic, IR, Optimization, Code Gen...', marks: 14, topic: 'Phases', module: 1, subject: 'Compiler Design', semester: 6, scheme: '2019', frequency: 5, label: 'Most repeated' },
      { question: 'Construct LR(0) parsing table.', answer: 'Table construction involves finding closures and goto functions...', marks: 14, topic: 'LR Parsing', module: 3, subject: 'Compiler Design', semester: 6, scheme: '2019', frequency: 3, label: 'Frequently asked' },
      { question: 'What is a Symbol Table?', answer: 'Structure to store info about identifiers.', marks: 7, topic: 'Symbol Table', module: 2, subject: 'Compiler Design', semester: 6, scheme: '2019', frequency: 1, label: 'Rare question' },
    ]
  });

  // Seed Notes
  await prisma.notes.create({
    data: {
      title: 'Module 1 - CD',
      fileUrl: '/notes/cd-mod1.pdf',
      module: 1,
      subject: 'Compiler Design',
      semester: 6
    }
  });

  // Seed Videos
  await prisma.youtubeVideo.create({
    data: {
      title: 'Compiler Design - Lexical Analysis',
      channelName: 'Neso Academy',
      link: 'https://www.youtube.com/watch?v=q6M_pXreXIs',
      subject: 'Compiler Design',
      topic: 'Lexical Analysis'
    }
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
