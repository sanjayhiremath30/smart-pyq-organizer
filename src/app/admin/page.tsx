'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, FileText, UploadCloud, Loader2, Database, BookOpen, Video, Trash2, Edit, LayoutDashboard, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pyq');

  // 🔐 PROTECT PAGE
  useEffect(() => {
    const isAdmin = localStorage.getItem('admin');
    if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans relative overflow-hidden flex">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-80 border-r border-white/10 bg-white/5 backdrop-blur-3xl flex flex-col p-6 z-10 shrink-0 shadow-2xl">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 border border-white/20">
            <Database size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Admin Portal</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-1">System Control</p>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <SidebarButton active={activeTab === 'pyq'} icon={<UploadCloud size={20} />} label="PYQ & Analysis" onClick={() => setActiveTab('pyq')} />
          <SidebarButton active={activeTab === 'notes'} icon={<FileText size={20} />} label="Module Notes" onClick={() => setActiveTab('notes')} />
          <SidebarButton active={activeTab === 'videos'} icon={<Video size={20} />} label="YouTube Resources" onClick={() => setActiveTab('videos')} />
          <SidebarButton active={activeTab === 'manage'} icon={<Settings size={20} />} label="Content Management" onClick={() => setActiveTab('manage')} />
        </nav>

        <button 
          onClick={handleLogout} 
          className="mt-auto flex justify-center items-center gap-2 px-5 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-semibold transition-all border border-red-500/20 hover:border-red-500/40"
        >
          <LogOut size={18} />
          <span>Secure Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto z-10 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'pyq' && <PyqTab />}
          {activeTab === 'notes' && <NotesTab />}
          {activeTab === 'videos' && <VideosTab />}
          {activeTab === 'manage' && <ManageTab />}
        </div>
      </main>
    </div>
  );
}

function SidebarButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 border ${
        active 
          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
          : 'bg-transparent text-slate-400 hover:text-white border-transparent hover:bg-white/5 hover:border-white/10'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// --------------------------------------------------------------------------------------
// 1. PYQ & AI Analysis Tab
// --------------------------------------------------------------------------------------
function PyqTab() {
  const [pyqFile, setPyqFile] = useState<File | null>(null);
  const [pyqSubject, setPyqSubject] = useState('');
  const [pyqSemester, setPyqSemester] = useState('');
  const [pyqScheme, setPyqScheme] = useState('2024');
  const [pyqModule, setPyqModule] = useState('1');
  const [pyqLoading, setPyqLoading] = useState(false);
  const [pyqMessage, setPyqMessage] = useState<{type: string, text: string} | null>(null);
  const [pyqReport, setPyqReport] = useState<string | null>(null);

  const handlePYQUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pyqFile || !pyqSubject || !pyqSemester || !pyqScheme || !pyqModule) {
      setPyqMessage({ type: 'error', text: 'All fields are strictly required.' });
      return;
    }

    setPyqLoading(true);
    setPyqMessage(null);
    setPyqReport(null);

    try {
      const formData = new FormData();
      formData.append('file', pyqFile);
      formData.append('subjectName', pyqSubject);
      formData.append('semester', pyqSemester);
      formData.append('scheme', pyqScheme);
      formData.append('module', pyqModule);

      const res = await fetch('/api/analyze-pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setPyqMessage({ type: 'success', text: `Success! Extracted ${data.questionsFound} AI-analyzed questions.` });
        setPyqReport(data.report);
        setPyqFile(null); setPyqSubject(''); setPyqSemester('');
      } else {
        setPyqMessage({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch (err) {
      setPyqMessage({ type: 'error', text: 'A critical server error occurred.' });
    } finally {
      setPyqLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">AI-Based PYQ Analysis</h2>
        <p className="text-slate-400 mt-2">Upload Previous Year Question Papers (PDF) for automated data extraction and repeated question discovery.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        {pyqMessage && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-semibold border backdrop-blur-md ${pyqMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
            {pyqMessage.text}
          </div>
        )}

        <form onSubmit={handlePYQUpload} className="space-y-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput label="Subject Name" value={pyqSubject} onChange={setPyqSubject} placeholder="e.g. Design & Analysis of Algorithms" />
            <GlassInput label="Semester" type="number" value={pyqSemester} onChange={setPyqSemester} placeholder="e.g. 5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassSelect label="Scheme" value={pyqScheme} onChange={setPyqScheme} options={[{val: '2019', label: '2019 Scheme'}, {val: '2022', label: '2022 Scheme'}, {val: '2024', label: '2024 Scheme'}]} />
            <GlassInput label="Module" type="number" value={pyqModule} onChange={setPyqModule} placeholder="e.g. 1" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Upload PDF File</label>
            <input 
              type="file" accept=".pdf" 
              onChange={(e) => setPyqFile(e.target.files?.[0] || null)} 
              className="w-full file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:transition-all bg-white/5 border border-white/10 rounded-xl cursor-pointer text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
            />
          </div>

          <button type="submit" disabled={pyqLoading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-xl font-bold mt-4 flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 border border-white/10">
            {pyqLoading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
            {pyqLoading ? 'Analyzing PDF Core Engine...' : 'Execute Analysis & Publish'}
          </button>
        </form>

        {pyqReport && (
          <div className="mt-8 border-t border-white/10 pt-8 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="text-emerald-400" size={24} />
              Extracted Analysis Report
            </h3>
            <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto text-slate-300 shadow-inner border border-slate-700">
              <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed">
                {pyqReport}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// --------------------------------------------------------------------------------------
// 2. Notes Upload Tab
// --------------------------------------------------------------------------------------
function NotesTab() {
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [moduleVal, setModuleVal] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: string, text: string} | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !subject || !moduleVal || !title) {
      setMessage({ type: 'error', text: 'All fields are required.' }); return;
    }
    setLoading(true); setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subject', subject);
      formData.append('semester', semester);
      formData.append('module', moduleVal);
      formData.append('title', title);

      const res = await fetch('/api/notes', { method: 'POST', body: formData });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Notes successfully uploaded to the system.' });
        setFile(null); setSubject(''); setSemester(''); setModuleVal(''); setTitle('');
      } else {
        const d = await res.json();
        setMessage({ type: 'error', text: d.error || 'Upload failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Sever error on upload.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Structured Module Notes</h2>
        <p className="text-slate-400 mt-2">Publish high-quality PDF notes categorized by subject and module for targeted learning.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl relative">
        {message && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-semibold border backdrop-blur-md ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleUpload} className="space-y-6">
          <GlassInput label="Notes Document Title" value={title} onChange={setTitle} placeholder="e.g. Unit 1: Introduction to Graphs" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassInput label="Subject Name" value={subject} onChange={setSubject} placeholder="e.g. Data Structures" />
            <GlassInput label="Semester" type="number" value={semester} onChange={setSemester} placeholder="e.g. 3" />
            <GlassInput label="Module" type="number" value={moduleVal} onChange={setModuleVal} placeholder="e.g. 1" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Upload File</label>
            <input 
              type="file" accept=".pdf,.doc,.docx" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              className="w-full file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600 bg-white/5 border border-white/10 rounded-xl cursor-pointer text-slate-300" 
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 rounded-xl font-bold mt-4 flex justify-center items-center gap-2 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
            {loading ? 'Committing to Database...' : 'Upload Notes'}
          </button>
        </form>
      </div>
    </div>
  );
}


// --------------------------------------------------------------------------------------
// 3. YouTube Links Tab
// --------------------------------------------------------------------------------------
function VideosTab() {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [subject, setSubject] = useState('');
  const [moduleVal, setModuleVal] = useState('');
  const [channel, setChannel] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: string, text: string} | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link || !subject || !title) {
      setMessage({ type: 'error', text: 'Title, Link, and Subject are required.' }); return;
    }
    setLoading(true); setMessage(null);
    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, link, subject, module: moduleVal, channelName: channel })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Video resource added successfully.' });
        setTitle(''); setLink(''); setSubject(''); setModuleVal(''); setChannel('');
      } else {
        const d = await res.json(); setMessage({ type: 'error', text: d.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Server error' });
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Curate Visual Learning</h2>
        <p className="text-slate-400 mt-2">Embed high-yield YouTube lecture videos to accelerate student comprehension.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl">
        {message && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-semibold border backdrop-blur-md ${message.type === 'success' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput label="Video Title" value={title} onChange={setTitle} placeholder="e.g. Master Operating Systems in 1 Hour" />
            <GlassInput label="YouTube URL" value={link} onChange={setLink} placeholder="https://youtu.be/..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassInput label="Subject Name" value={subject} onChange={setSubject} placeholder="e.g. Operating Systems" />
            <GlassInput label="Module" type="number" value={moduleVal} onChange={setModuleVal} placeholder="e.g. 2" />
            <GlassInput label="Channel Name (Optional)" value={channel} onChange={setChannel} placeholder="e.g. Gate Smashers" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white py-4 rounded-xl font-bold mt-4 flex justify-center items-center gap-2 transition-all shadow-lg shadow-red-500/25 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Video size={20} />}
            {loading ? 'Linking...' : 'Add Video Lecture'}
          </button>
        </form>
      </div>
    </div>
  );
}


// --------------------------------------------------------------------------------------
// 4. Content Management Tab (Delete, Update)
// --------------------------------------------------------------------------------------
function ManageTab() {
  const [activeSub, setActiveSub] = useState<'papers'|'notes'|'videos'>('papers');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeSub]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeSub === 'papers') {
        const r = await fetch('/api/papers'); setData(await r.json());
      } else if (activeSub === 'notes') {
        const r = await fetch('/api/notes'); setData(await r.json());
      } else {
        const r = await fetch('/api/youtube'); setData(await r.json());
      }
    } catch(e) { console.error('Error fetching data'); }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if(!confirm('Are you absolutely sure you want to delete this resource?')) return;
    try {
      const endpoint = activeSub === 'papers' ? '/api/papers' : (activeSub === 'notes' ? '/api/notes' : '/api/youtube');
      const r = await fetch(endpoint, {
        method: 'DELETE',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({id})
      });
      if(r.ok) fetchData();
    } catch(e) { console.error('Deletion failure'); }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">System Content Management</h2>
        <p className="text-slate-400 mt-2">Maintain system accuracy. Edit and delete incorrect or outdated academic resources.</p>
      </div>

      <div className="flex gap-4 mb-6 p-1 bg-white/5 backdrop-blur-md rounded-2xl w-fit border border-white/10">
        <SubTabBtn active={activeSub === 'papers'} label="PYQ Papers" onClick={() => setActiveSub('papers')} />
        <SubTabBtn active={activeSub === 'notes'} label="Notes" onClick={() => setActiveSub('notes')} />
        <SubTabBtn active={activeSub === 'videos'} label="Videos" onClick={() => setActiveSub('videos')} />
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-400" size={32} /></div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-sm font-semibold">
                  <th className="p-4 pl-6">Title / File</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4 text-center">Module/Sem</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500">No resources found.</td></tr>
                )}
                {data.map(item => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 pl-6 max-w-xs truncate font-medium">{item.title || item.fileName || 'Untitled'}</td>
                    <td className="p-4 text-slate-300">{item.subject}</td>
                    <td className="p-4 text-center text-slate-400">
                      {activeSub === 'papers' ? `Sem ${item.semester}` : `Mod ${item.module || '-'}`}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/10 hover:border-red-500/30">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SubTabBtn({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
        active 
          ? 'bg-slate-700/50 text-white shadow-md border border-white/10' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );
}

// --------------------------------------------------------------------------------------
// Unified UI Components 
// --------------------------------------------------------------------------------------

function GlassInput({ label, type = 'text', value, onChange, placeholder }: any) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium" 
        placeholder={placeholder} 
      />
    </div>
  );
}

function GlassSelect({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium appearance-none"
      >
        <option value="" disabled className="bg-slate-800 text-slate-400">Select...</option>
        {options.map((o: any) => (
          <option key={o.val} value={o.val} className="bg-slate-800 text-white">{o.label}</option>
        ))}
      </select>
    </div>
  );
}