'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
  const [firstName, setFirstName] = useState('Student');
  const [lastName, setLastName] = useState('User');

  useEffect(() => {
    // Check locally every few seconds so it updates when saved from Account page, or just read on mount
    const updateHeader = () => {
      const storedFirst = localStorage.getItem('user_first_name');
      const storedLast = localStorage.getItem('user_last_name');
      if (storedFirst) setFirstName(storedFirst);
      if (storedLast) setLastName(storedLast);
    };

    updateHeader();
    window.addEventListener('storage', updateHeader); // In case of multi-tab
    
    // Polling is a quick non-fancy way to keep it synced on the same document without global state managers
    const interval = setInterval(updateHeader, 1000);

    return () => {
      window.removeEventListener('storage', updateHeader);
      clearInterval(interval);
    };
  }, []);

  const initial = firstName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 ml-64">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800">Smart PYQ Organizer Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search questions, notes..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{firstName} {lastName}</p>
              <p className="text-xs text-slate-500">2019 Scheme</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold border border-indigo-200 uppercase">
              {initial}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
