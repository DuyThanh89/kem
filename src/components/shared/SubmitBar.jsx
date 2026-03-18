import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export function SubmitBar({ fields, onSubmit, submitted, feedback, label = "Xác nhận ✓" }) {
  const canSubmit = !submitted && fields.length > 0 && fields.every(f => String(f).trim() !== "");

  const getButtonState = () => {
    if (feedback === 'correct') return {
      bg: "bg-green-500 text-white",
      text: "ĐÚNG RỒI! 🎉",
      icon: <CheckCircle2 size={24} strokeWidth={3} />
    };
    if (feedback === 'wrong') return {
      bg: "bg-rose-500 text-white",
      text: "CHƯA ĐÚNG RỒI 💡",
      icon: <XCircle size={24} strokeWidth={3} />
    };
    if (submitted) return {
      bg: "bg-blue-500 opacity-50 text-white",
      text: "Đang kiểm tra...",
      icon: null
    };
    return {
      bg: canSubmit 
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/25 text-white" 
        : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none",
      text: label,
      icon: null
    };
  };

  const state = getButtonState();

  return (
    <div className="w-full mt-4">
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className={`w-full py-4 md:py-5 px-4 md:px-8 rounded-[2rem] font-black text-lg md:text-2xl transition-all shadow-xl transform active:scale-95 flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap ${state.bg}`}
      >
        {state.icon && React.cloneElement(state.icon, { size: 20, className: "shrink-0 md:w-6 md:h-6" })}
        {state.text}
      </button>
    </div>
  );
}
