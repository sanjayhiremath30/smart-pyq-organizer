import React from 'react';
import { Eye, TrendingUp, Star, Youtube } from 'lucide-react';

interface QuestionCardProps {
  id?: number;
  text: string;
  marks: number;
  frequency: number;
  answer: string;
  videoUrl?: string | null;
  label?: string | null;
  hideAnswer?: boolean;
}

const QuestionCard = ({ id, text, marks, frequency, answer, videoUrl, label, hideAnswer }: QuestionCardProps) => {
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const getBadgeColor = (m: number) => {
    if (m >= 14) return 'bg-rose-100 text-rose-700 border-rose-200';
    if (m >= 8) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (m >= 7) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  const handleToggleFavorite = async () => {
    if (!id) return;
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: id })
      });
      const data = await res.json();
      if (res.ok) {
        setIsFavorite(data.saved);
      }
    } catch (error) {
       console.error("Failed to update favorites");
    }
  };

  return (
    <div className="dashboard-card p-5 flex flex-col h-full group relative hover:shadow-xl transition-shadow border-slate-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
           <span className={`badge-marks border ${getBadgeColor(marks)}`}>
            {marks} Marks
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            <TrendingUp size={14} className="text-indigo-500" />
            Repeated: {frequency}x
          </div>
          {label && (
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${
              label === 'Most repeated' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
              label === 'Frequently asked' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
              'bg-slate-50 text-slate-500 border-slate-100'
            }`}>
              {label}
            </span>
          )}
        </div>
        
        <button 
          onClick={handleToggleFavorite}
          className={`p-1.5 rounded-lg transition-all ${isFavorite ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'}`}
        >
          <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      
      <p className="text-slate-700 font-medium mb-6 flex-1 leading-relaxed">
        {text}
      </p>

      {showAnswer && (
        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-slate-600 italic font-semibold">AI Generated Answer:</p>
          <p className="text-sm text-slate-800 mt-2 leading-relaxed">{answer}</p>
          
          {videoUrl && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <a 
                href={videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
              >
                <Youtube size={16} />
                Watch Recommended Topic Tutorial
              </a>
            </div>
          )}
        </div>
      )}
      
      {(!hideAnswer || showAnswer) && (
        <div className="grid grid-cols-1 gap-2 mt-auto">
          <button 
            onClick={() => setShowAnswer(!showAnswer)}
            className="btn-secondary w-full flex items-center justify-center gap-2 group"
          >
            <Eye size={18} className="text-indigo-500 group-hover:scale-110 transition-transform" />
            {showAnswer ? 'Hide Analysis' : 'View Answer & Analysis'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
