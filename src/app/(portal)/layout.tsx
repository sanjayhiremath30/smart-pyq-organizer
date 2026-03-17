import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen relative">
        <Navbar />
        <main className="ml-64 p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
