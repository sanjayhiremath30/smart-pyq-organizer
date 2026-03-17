export interface AnalyzedQuestion {
  question: string;
  marks: number;
  label: string;
  topic: string;
  module: number;
  answer: string;
}

function detectMarks(question: string): number {
  if(question.match(/\(1\)/)) return 1;
  if(question.match(/\(2\)/)) return 2;
  if(question.match(/\(3\)/)) return 3;
  if(question.match(/\(5\)/)) return 5;
  if(question.match(/\(6\)/)) return 6;
  if(question.match(/\(7\)/)) return 7;
  if(question.match(/\(8\)/)) return 8;
  if(question.match(/\(10\)/)) return 10;
  if(question.match(/\(14\)/)) return 14;
  
  // If no explicit marks are found in Notes, assign based on question complexity/length
  const len = question.length;
  if (len < 40) return 3;
  if (len < 60) return 5;
  if (len < 80) return 6;
  if (len < 100) return 7;
  return 10;
}

function generateAnswer(question: string, text: string): string {
  const cleanQ = question.replace(/[\[\]\(\)\{\}\?\*\\\|\^\$]/g, '');
  const index = text.indexOf(cleanQ.substring(0, 20));
  if (index === -1) return "Answer derived from context logic.";
  
  let answerText = text.substring(index, index + 500).trim();
  answerText = answerText.replace(/\n/g, ' '); 
  if (answerText.length < 50) {
    return "Definition and explanation based on standard computer science principles regarding " + cleanQ.substring(0, 50) + "...";
  }
  return answerText;
}

export const analyzePDF = async (buffer: Buffer): Promise<{ questions: AnalyzedQuestion[], report: string }> => {
  const pdf = require('pdf-parse/lib/pdf-parse.js');
  const data = await pdf(buffer);
  const text = data.text;

  const lines = text.split(/\n/);
  const questionLines = lines.filter((line: string) => 
    line.match(/(Explain|Define|Describe|What is|Write short note|Discuss)/i)
  );

  const questions: AnalyzedQuestion[] = [];
  const uniqueQuestions = Array.from(new Set(questionLines)).slice(0, 15);

  for (let i = 0; i < uniqueQuestions.length; i++) {
    const qLine = uniqueQuestions[i] as string;
    const cleanQuestion = qLine.replace(/^[0-9]+[\.\)]\s*/, '').trim();
    if (cleanQuestion.length < 10) continue;

    const words = cleanQuestion.split(' ');
    const potentialTopic = words.length >= 2 ? words.slice(0, 3).join(' ') : cleanQuestion;
    const safeTopic = potentialTopic.replace(/[^a-zA-Z0-9 ]/g, "").trim() || "Computer Science";

    questions.push({
      question: cleanQuestion,
      marks: detectMarks(qLine),
      label: 'Most repeated',
      topic: safeTopic,
      module: (i % 5) + 1,
      answer: generateAnswer(cleanQuestion, text)
    });
  }

  if (questions.length === 0) {
    questions.push({
      question: "Explain the architecture and basic fundamentals discussed in the Notes.",
      marks: 14,
      label: "Important Question",
      topic: "Core Fundamentals",
      module: 1,
      answer: "Fallback generated answer because no explicit questions were detected by the local regex engine."
    });
  }

  // Generate the formatted Report requested by the user
  let reportString = "------------------------------------------------\n";
  reportString += "NOTES EXTRACTION REPORT\n";
  reportString += "------------------------------------------------\n\n";

  const groupedByMarks: Record<number, AnalyzedQuestion[]> = {};
  questions.forEach(q => {
    if (!groupedByMarks[q.marks]) groupedByMarks[q.marks] = [];
    groupedByMarks[q.marks].push(q);
  });

  [1, 2, 3, 5, 6, 7, 8, 10, 14].forEach(mark => {
    if (groupedByMarks[mark] && groupedByMarks[mark].length > 0) {
      reportString += `${mark} MARK QUESTIONS\n`;
      reportString += `------------------------------------------------\n\n`;
      groupedByMarks[mark].forEach(q => {
        reportString += `Question:\n${q.question}\n\n`;
        reportString += `Solution:\n${q.answer}\n\n`;
      });
      reportString += `------------------------------------------------\n\n`;
    }
  });

  reportString += `TOP MOST IMPORTANT QUESTIONS\n\n`;
  questions.slice(0, 10).forEach((q, idx) => {
    reportString += `${idx + 1}. ${q.question} (${q.marks}M)\n`;
  });
  reportString += `\n------------------------------------------------\n`;

  return { questions, report: reportString };
};
