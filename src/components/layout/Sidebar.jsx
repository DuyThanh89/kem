import React from 'react';
import { BookOpen, History, Trophy, User } from 'lucide-react';

export function Sidebar({ currentMode, setMode }) {
  const links = [
    { id: 'menu', label: 'Làm bài', icon: BookOpen },
    { id: 'history', label: 'Xem lại', icon: History },
    { id: 'achievements', label: 'Thành tích', icon: Trophy },
    { id: 'profile', label: 'Tài khoản', icon: User },
  ];

  return (
    <aside className="w-64 h-screen glass-card rounded-none border-y-0 border-l-0 p-6 flex flex-col gap-8">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200">
          <span className="mb-0.5 ml-0.5">K</span>
        </div>
        <span className="text-2xl font-black text-slate-800 tracking-tight">Kem Math</span>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => setMode(link.id)}
            className={`sidebar-link ${currentMode === link.id ? 'sidebar-link-active' : ''}`}
          >
            <link.icon size={22} strokeWidth={2.5} />
            <span>{link.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
