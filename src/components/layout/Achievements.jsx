import React from 'react';
import { useGameStore, BADGES } from '../../store/gameStore';
import { Trophy, Star, Medal, Target } from 'lucide-react';

export function Achievements() {
  const { badges, bestStreak, totalCorrect } = useGameStore();

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Thành tích của Bé</h1>
        <p className="text-slate-400 font-bold text-lg">Cùng sưu tập trọn bộ huy hiệu toán học nhé! 🏆</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BADGES.map((badge) => {
          const isUnlocked = badges.includes(badge.id);
          return (
            <div 
              key={badge.id} 
              className={`glass-card p-8 flex flex-col items-center text-center gap-4 transition-all duration-500 ${
                isUnlocked ? 'scale-100 opacity-100 shadow-xl shadow-yellow-500/10' : 'scale-95 opacity-40 grayscale'
              }`}
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-inner ${
                isUnlocked ? 'bg-gradient-to-br from-yellow-300 to-orange-400' : 'bg-slate-100'
              }`}>
                {badge.icon}
              </div>
              <div>
                <h3 className={`text-xl font-black ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                  {badge.title}
                </h3>
                <p className="text-sm font-bold text-slate-400 mt-1">{badge.desc}</p>
              </div>
              {isUnlocked && (
                <div className="mt-2 px-4 py-1 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-wider">
                  Đã đạt được
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="glass-card p-8 flex flex-col items-center gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
          <Target size={32} />
          <span className="text-sm font-black uppercase opacity-70">Chuỗi cao nhất</span>
          <span className="text-4xl font-black">{bestStreak}</span>
        </div>
        <div className="glass-card p-8 flex flex-col items-center gap-2 bg-gradient-to-br from-orange-400 to-rose-500 text-white border-0">
          <Star size={32} />
          <span className="text-sm font-black uppercase opacity-70">Số câu đúng</span>
          <span className="text-4xl font-black">{totalCorrect}</span>
        </div>
        <div className="glass-card p-8 flex flex-col items-center gap-2 bg-gradient-to-br from-emerald-400 to-teal-500 text-white border-0">
          <Medal size={32} />
          <span className="text-sm font-black uppercase opacity-70">Huy hiệu</span>
          <span className="text-4xl font-black">{badges.length} / {BADGES.length}</span>
        </div>
      </div>
    </div>
  );
}
