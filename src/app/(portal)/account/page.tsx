'use client';

import { useState, useEffect } from 'react';

export default function AccountPage() {
  const [firstName, setFirstName] = useState('Student');
  const [lastName, setLastName] = useState('User');
  const [email, setEmail] = useState('student@example.com');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const storedFirst = localStorage.getItem('user_first_name');
    const storedLast = localStorage.getItem('user_last_name');
    if (storedFirst) setFirstName(storedFirst);
    if (storedLast) setLastName(storedLast);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_first_name', firstName);
    localStorage.setItem('user_last_name', lastName);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Manage Account</h1>
      <div className="dashboard-card p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
           <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-sm uppercase">
             {initial}
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800">{firstName} {lastName}</h2>
             <p className="text-slate-500">{email}</p>
           </div>
        </div>
        
        <form className="space-y-4" onSubmit={handleSave}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
              <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
              <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Save Changes
            </button>
            {isSaved && <span className="text-emerald-600 font-medium text-sm animate-in fade-in duration-300">Changes saved successfully!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
