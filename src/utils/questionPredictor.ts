export interface PredictedQuestion {
  id: number;
  question: string;
  marks: number;
  probability: number;
  frequency: number;
  subject: string;
}

export const predictQuestions = (questions: any[]): PredictedQuestion[] => {
  // Normalize frequency and marks to calculate a probability score
  // Formula: Score = (Frequency * 10) + (Marks * 2) + (Some recency logic)
  
  const predictions = questions.map(q => {
    // Basic weightage: 
    // Frequency is the most important (50%)
    // Marks categorized weight (30%)
    // Random fluctuation to simulate "recency/trend" (20%)
    
    const freqWeight = Math.min(q.frequency * 8, 50);
    const marksWeight = Math.min((q.marks / 14) * 30, 30);
    const trendWeight = Math.floor(Math.random() * 20); // Simulating recency analysis
    
    let probability = freqWeight + marksWeight + trendWeight;
    
    // Ensure probability is realistic
    if (probability > 98) probability = 98;
    if (probability < 20 && q.frequency > 1) probability = 45;

    return {
      id: q.id,
      question: q.question,
      marks: q.marks,
      frequency: q.frequency,
      subject: q.subject,
      probability: Math.round(probability)
    };
  });

  // Sort by highest probability and return top 10
  return predictions
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 10);
};
