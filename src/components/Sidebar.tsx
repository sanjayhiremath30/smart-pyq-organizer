'use client';

import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Star,
  FileText,
  Youtube,
  UserCog,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Notes', icon: FileText, href: '/notes' },
    { name: 'YouTube Channels', icon: Youtube, href: '/youtube' },
    { name: 'Manage Account', icon: UserCog, href: '/account' },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 text-xl font-bold border-b border-slate-800">
        PYQ Organizer
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors group"
          >
            <item.icon size={20} className="text-slate-400 group-hover:text-white" />
            <span className="text-slate-300 group-hover:text-white">{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => router.push('/login')}
          className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-900/20 text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
