'use client';

import React, { useState, useEffect } from 'react';
import NotesCard from '@/components/NotesCard';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error("Error fetching notes:", err));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Study Notes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.length > 0 ? (
          notes.map((n: any) => (
            <div key={n.id} className="space-y-2">
               <div className="text-xs font-bold text-slate-400 uppercase">{n.subject} - Module {n.module}</div>
               <NotesCard 
                title={n.title || "Module Notes"}
                description={n.description || "Comprehensive exam notes"}
                fileUrl={n.fileUrl}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full dashboard-card p-10 text-center text-slate-400">
            No notes found.
          </div>
        )}
      </div>
    </div>
  );
}
