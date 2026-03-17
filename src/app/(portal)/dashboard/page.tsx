'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Award, 
  Zap, 
  BookMarked, 
  Layers, 
  Youtube as YoutubeIcon, 
  FileText,
  ChevronDown,
  Bell,
  BookOpen
} from 'lucide-react';
import QuestionCard from '@/components/QuestionCard';
import YoutubeCard from '@/components/YoutubeCard';
import NotesCard from '@/components/NotesCard';

export default function StudentDashboard() {
  const [selectedScheme, setSelectedScheme] = useState('2019');
  const [selectedSemester, setSelectedSemester] = useState('6');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedModule, setSelectedModule] = useState('1');
  
  const [subjects, setSubjects] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [predictedQuestions, setPredictedQuestions] = useState<any[]>([]);
  const [modelPapers, setModelPapers] = useState<any[]>([]);
  const [analysisReports, setAnalysisReports] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const schemes = ['2019', '2024'];
  const modules = [1, 2, 3, 4, 5];

  // Fetch subjects when scheme or semester changes
  useEffect(() => {
    fetch(`/api/subjects?scheme=${selectedScheme}&semester=${selectedSemester}`)
      .then(res => res.json())
      .then(data => {
        setSubjects(data);
        if (data.length > 0) {
          setSelectedSubject(data[0].name);
        } else {
          setSelectedSubject('');
        }
      });
  }, [selectedScheme, selectedSemester]);

  // Fetch Global Notifications
  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, []);

  // Fetch data when subject or module changes
  useEffect(() => {
    if (!selectedSubject) return;

    // Fetch questions
    fetch(`/api/questions?subject=${selectedSubject}&module=${selectedModule}`)
      .then(res => res.json())
      .then(data => setQuestions(data));
      
    // Fetch predictions
    fetch(`/api/predict?subject=${selectedSubject}`)
      .then(res => res.json())
      .then(data => setPredictedQuestions(data));
      
    // Fetch notes
    fetch(`/api/notes?subject=${selectedSubject}&module=${selectedModule}`)
      .then(res => res.json())
      .then(data => setNotes(data));
      
    // Fetch videos for the selected subject (sidebar section)
    fetch(`/api/youtube?subject=${selectedSubject}&semester=${selectedSemester}&scheme=${selectedScheme}`)
      .then(res => res.json())
      .then(data => setVideos(data));
      
    // Fetch model papers
    fetch(`/api/model-papers?subject=${selectedSubject}&semester=${selectedSemester}&scheme=${selectedScheme}`)
      .then(res => res.json())
      .then(data => setModelPapers(data));
      
    // Fetch uploaded PyQ/Notes reports
    fetch(`/api/papers?subject=${selectedSubject}&semester=${selectedSemester}`)
      .then(res => res.json())
      .then(data => setAnalysisReports(data.filter((r: any) => r.analysisReport)));
  }, [selectedSubject, selectedModule, selectedSemester, selectedScheme]);

  // Group questions by marks for the dashboard UI
  const marksCategories = [1, 2, 3, 5, 6, 7, 8, 10, 14];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      
      {/* Notifications Banner / Scroller */}
      {notifications.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="bg-indigo-100 p-2 rounded-full shrink-0">
            <Bell size={20} className="text-indigo-600" />
          </div>
          <div className="w-full overflow-hidden">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Recent Admin Updates</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {notifications.map((n) => (
                <div key={n.id} className="bg-white rounded-lg p-3 border border-slate-200 min-w-[280px] flex-shrink-0 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-indigo-500 mb-1 block">{n.type.replace('_', ' ')}</span>
                  <p className="text-sm font-medium text-slate-700">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step Flow Selection */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Layers className="text-indigo-600" size={24} />
          <h2 className="text-2xl font-bold text-slate-800">Study Roadmap</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Scheme Selection */}
          <div className="dashboard-card p-5 relative group">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Scheme</label>
            <div className="relative">
              <select 
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-800 text-lg appearance-none cursor-pointer focus:outline-none"
              >
                {schemes.map(s => <option key={s} value={s}>{s} Scheme</option>)}
              </select>
              <ChevronDown className="absolute right-0 top-1 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Semester Selection */}
          <div className="dashboard-card p-5 relative group">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Semester</label>
            <div className="relative">
              <select 
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-800 text-lg appearance-none cursor-pointer focus:outline-none"
              >
                {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
              <ChevronDown className="absolute right-0 top-1 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Subject Selection */}
          <div className="dashboard-card p-5 relative group overflow-hidden">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Subject</label>
            <div className="relative">
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-800 text-lg appearance-none cursor-pointer focus:outline-none"
                disabled={subjects.length === 0}
              >
                {subjects.length > 0 ? (
                  subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)
                ) : (
                  <option>No subjects</option>
                )}
              </select>
              <ChevronDown className="absolute right-0 top-1 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Module Selection */}
          <div className="dashboard-card p-5 relative group">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Module</label>
            <div className="relative">
              <select 
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-800 text-lg appearance-none cursor-pointer focus:outline-none"
              >
                {modules.map(m => <option key={m} value={m}>Module {m}</option>)}
              </select>
              <ChevronDown className="absolute right-0 top-1 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Questions Center */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookMarked className="text-rose-500" size={24} />
                <h2 className="text-2xl font-bold text-slate-800">Most Repeated Questions</h2>
              </div>
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {questions.length} Questions Found
              </span>
            </div>
            
            {marksCategories.map(mark => {
              const filteredQuestions = questions.filter((q: any) => q.marks === mark);
              if (filteredQuestions.length === 0) return null;
              
              return (
                <div key={mark} className="mb-10">
                  <div className="flex items-center gap-2 mb-4 border-l-4 border-indigo-500 pl-3">
                    <h3 className="text-lg font-bold text-slate-700">{mark} Mark Questions</h3>
                    <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                      {filteredQuestions.length} Found
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredQuestions.map((q: any) => (
                      <QuestionCard 
                        key={q.id}
                        id={q.id}
                        text={q.question}
                        marks={q.marks}
                        frequency={q.frequency || 1}
                        answer={q.answer}
                        label={q.label}
                        videoUrl={q.relatedVideo}
                        hideAnswer={true}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {questions.length === 0 && (
              <div className="dashboard-card p-10 text-center text-slate-400 italic">
                No questions available for this selection. <br/>
                Please upload a PYQ PDF in the Admin panel to automatically generate and analyze content.
              </div>
            )}
            
            {/* Extracted Analysis Reports Section */}
            {analysisReports.length > 0 && (
              <section className="bg-slate-900 border border-slate-700 rounded-3xl p-8 mb-10 shadow-xl text-white">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="text-emerald-400" size={28} />
                  <div>
                    <h2 className="text-2xl font-bold">Important Questions with Solutions</h2>
                    <p className="text-slate-400 text-sm">Full analysis reports automatically extracted from instructor notes</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {analysisReports.map(report => (
                    <div key={report.id} className="bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-600">
                       <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Report for: {report.fileName}</h3>
                       <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300 shadow-inner">
                         <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed">
                           {report.analysisReport}
                         </pre>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </section>

          {/* Predicted Questions Section */}
          {predictedQuestions.length > 0 && (
            <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <Zap className="text-amber-400" size={28} />
                <div>
                  <h2 className="text-2xl font-bold">Predicted Next Exam Questions</h2>
                  <p className="text-slate-400 text-sm">AI-powered probability scores based on frequency & marks analysis</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {predictedQuestions.map((pq, idx) => (
                  <div key={pq.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <p className="font-medium text-slate-200 leading-relaxed">
                        <span className="text-amber-400 mr-2 font-bold">#{idx + 1}</span>
                        {pq.question}
                      </p>
                      <div className="text-right shrink-0">
                        <span className="text-2xl font-black text-amber-400">{pq.probability}%</span>
                        <p className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold">Probability</p>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-400 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${pq.probability}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-3 mb-6">
              <YoutubeIcon className="text-rose-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">Subject Library</h2>
            </div>
            
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((v: any) => (
                  <YoutubeCard 
                    key={v.id}
                    title={v.title}
                    channelName={v.channelName || "Teacher"}
                    videoUrl={v.link}
                  />
                ))}
              </div>
            ) : (
              <div className="dashboard-card p-10 text-center text-slate-400">
                No recommended lectures yet.
              </div>
            )}
          </section>

          {/* Model Papers Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-indigo-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">Previous Year Model Papers</h2>
            </div>
            
            {modelPapers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modelPapers.map((m: any) => (
                  <a 
                    key={m.id} 
                    href={m.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                      <FileText className="text-rose-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">{m.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{m.subject}</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="dashboard-card p-10 text-center text-slate-400 italic">
                No raw model papers uploaded for this subject yet.
              </div>
            )}
          </section>
        </div>

        {/* Right: Resources & Status */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-indigo-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">Module Resources</h2>
            </div>
            
            <div className="space-y-4">
              {notes.length > 0 ? (
                notes.map((n: any) => (
                  <NotesCard 
                    key={n.id}
                    title={n.title}
                    description={n.description || "Module study notes"}
                    fileUrl={n.fileUrl}
                  />
                ))
              ) : (
                <div className="dashboard-card p-6 text-center text-slate-400">
                  No notes available.
                </div>
              )}
            </div>
          </section>

          <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
            <div className="flex items-center gap-3 mb-6">
              <Award className="text-indigo-200" size={28} />
              <h2 className="text-2xl font-bold">Smart Benefits</h2>
            </div>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <Zap size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Targeted Preparation</h4>
                  <p className="text-sm text-indigo-100 font-medium">Focus on questions that appear in exams repeatedly.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <BookMarked size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Saved Time</h4>
                  <p className="text-sm text-indigo-100 font-medium">Stop searching for answers. Get AI-generated short answers instantly.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <Layers size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Centralized Hub</h4>
                  <p className="text-sm text-indigo-100 font-medium">PDFs, notes, videos and questions all in one intelligent dashboard.</p>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
