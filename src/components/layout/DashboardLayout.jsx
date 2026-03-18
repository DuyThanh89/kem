import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from '../shared/TopBar';
import { useGameStore } from '../../store/gameStore';

export function DashboardLayout({ children }) {
  const { mode, setMode } = useGameStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          currentMode={mode} 
          setMode={(m) => { setMode(m); setSidebarOpen(false); }} 
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-10 pb-6 md:pb-10 relative">
          {children}
          
        </main>
      </div>
    </div>
  );
}
