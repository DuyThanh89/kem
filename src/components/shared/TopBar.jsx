import { Menu } from 'lucide-react';

export function TopBar({ onMenuClick }) {
  return (
    <header className="flex items-center justify-between h-20 px-6 lg:px-10">
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1 hidden sm:block"></div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm hover:scale-110 transition-transform">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </button>
        <div className="flex flex-col text-slate-400 hover:text-slate-600 cursor-pointer">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </header>
  );
}
