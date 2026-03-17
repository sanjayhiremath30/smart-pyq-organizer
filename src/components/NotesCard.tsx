import React from 'react';
import { Download, FileText } from 'lucide-react';

interface NotesCardProps {
  title: string;
  description: string;
  fileUrl: string;
}

const NotesCard = ({ title, description, fileUrl }: NotesCardProps) => {
  return (
    <div className="dashboard-card p-6 flex items-start gap-5">
      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
        <FileText size={28} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-800 text-lg mb-1">{title}</h3>
        <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-2">
          {description}
        </p>
        <button className="text-indigo-600 font-semibold text-sm flex items-center gap-2 hover:text-indigo-800 transition-colors">
          <Download size={18} />
          Download Module Notes
        </button>
      </div>
    </div>
  );
};

export default NotesCard;
