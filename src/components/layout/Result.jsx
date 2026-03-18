import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Trophy, RefreshCcw, Home, Star, Percent } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatNumber } from '../../generators/utils';


export function Result() {
  const { score, questions, setMode, quizType } = useGameStore();
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    if (percentage >= 80) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [percentage]);

  return (
    <div className="flex flex-col items-center justify-center py-8 max-w-2xl mx-auto">
      <div className="glass-card w-full p-12 flex flex-col items-center gap-8 relative overflow-hidden">
        {/* Decorative Stars */}
        <div className="absolute top-10 left-10 text-yellow-400 rotate-12 opacity-20"><Star size={48} fill="currentColor" /></div>
        <div className="absolute bottom-10 right-10 text-blue-400 -rotate-12 opacity-20"><Star size={64} fill="currentColor" /></div>

        <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-orange-200">
          <Trophy size={64} strokeWidth={2.5} />
        </div>

        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-2 whitespace-nowrap">Hoàn thành!</h1>
          <p className="text-sm md:text-xl font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Kết quả bài học của bé</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-6 w-full">
          <div className="bg-blue-50 p-4 md:p-6 rounded-[2rem] flex flex-col items-center border-2 border-blue-100 min-w-0">
            <span className="text-xs md:text-sm font-black text-blue-400 uppercase tracking-wide">Chính xác</span>
            <span className="text-2xl md:text-4xl font-black text-blue-600 whitespace-nowrap">{formatNumber(score)} / {formatNumber(total)}</span>
          </div>
          <div className="bg-indigo-50 p-4 md:p-6 rounded-[2rem] flex flex-col items-center border-2 border-indigo-100 min-w-0">
            <span className="text-xs md:text-sm font-black text-indigo-400 uppercase tracking-wide">Tỷ lệ</span>
            <span className="text-2xl md:text-4xl font-black text-indigo-600 whitespace-nowrap">{percentage}%</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 md:gap-4 mt-4">
          <button 
            onClick={() => setMode('menu')}
            className="w-full py-4 md:py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-black text-base md:text-xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 md:gap-3 transform active:scale-95 transition-all"
          >
            <Home size={20} className="shrink-0" /> Quay về Trang chủ
          </button>
          
          <button 
            onClick={() => setMode('menu')}
            className="w-full py-4 md:py-5 bg-white border-4 border-slate-100 text-slate-600 rounded-2xl font-black text-base md:text-xl flex items-center justify-center gap-2 md:gap-3 hover:bg-slate-50 transform active:scale-95 transition-all"
          >
            <RefreshCcw size={20} className="shrink-0" /> Làm lại bài này
          </button>
        </div>
      </div>
    </div>
  );
}
