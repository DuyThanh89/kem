import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store';
import { LESSON_TYPES, generateQuestions } from '../generators';
import { ArithmeticQ, ClockReadQ } from './QuestionTypes';
import { Trophy, Clock, History, LayoutGrid, ArrowLeft, Star, Flame, Zap } from 'lucide-react';
import { getHistoryByDate } from '../db';
import confetti from 'canvas-confetti';

export function Nav({ currentView }) {
  const setMode = useGameStore(s => s.setMode);
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 flex justify-around py-3 px-6 z-50">
      <button onClick={() => setMode('menu')} className={`flex flex-col items-center gap-1 ${currentView === 'menu' ? 'text-blue-600' : 'text-gray-400'}`}>
        <LayoutGrid size={24} /> <span className="text-xs font-bold">BÀI HỌC</span>
      </button>
      <button onClick={() => setMode('history')} className={`flex flex-col items-center gap-1 ${currentView === 'history' ? 'text-blue-600' : 'text-gray-400'}`}>
        <History size={24} /> <span className="text-xs font-bold">LỊCH SỬ</span>
      </button>
    </div>
  );
}

export function Menu() {
  const startQuiz = useGameStore(s => s.startQuiz);
  return (
    <div className="pb-20">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Học Toán Lớp 3 🎒</h1>
        <p className="text-gray-500 font-medium">Bé muốn thử thách bài tập nào hôm nay?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LESSON_TYPES.map(lesson => (
          <button
            key={lesson.id}
            disabled={lesson.disabled}
            onClick={() => startQuiz(lesson.id, generateQuestions(lesson.id))}
            className={`group relative flex items-center p-6 rounded-3xl bg-white border-4 border-transparent hover:border-blue-400 transition-all shadow-xl hover:shadow-2xl overflow-hidden ${lesson.disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
          >
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-inner ${lesson.color} mr-6 text-white group-hover:scale-110 transition-transform`}>
              {lesson.icon}
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-black text-gray-800 mb-1">{lesson.name}</h3>
              <p className="text-sm font-bold text-gray-400 group-hover:text-blue-400">Ấn để bắt đầu!</p>
            </div>
            {lesson.disabled && (
               <div className="absolute top-2 right-2 bg-gray-200 text-gray-500 px-2 py-1 rounded-lg text-xs font-black uppercase">Sắp có</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Quiz() {
  const { questions, current, quizType, submitAnswer, score, streak } = useGameStore();
  const q = questions[current];
  
  if (!q) return null;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-10 bg-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-black">
              {current + 1}
           </div>
           <span className="text-gray-400 font-bold">/ {questions.length}</span>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-black">
              <Flame size={18} /> {streak}
           </div>
           <div className="flex items-center gap-1 bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full font-black">
              <Star size={18} /> {score}
           </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[40px] shadow-2xl border-b-8 border-gray-100 min-h-[400px] flex flex-col justify-center">
        {quizType === 'arithmetic' && <ArithmeticQ q={q} onSubmit={submitAnswer} />}
        {quizType === 'clock' && <ClockReadQ q={q} onSubmit={submitAnswer} />}
      </div>
    </div>
  );
}

export function Result() {
  const { score, questions, setMode } = useGameStore();
  const percent = Math.round((score / questions.length) * 100);

  useEffect(() => {
    if (percent >= 80) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }, [percent]);

  return (
    <div className="text-center max-w-md mx-auto py-8">
      <div className="mb-10 text-9xl">
        {percent >= 80 ? "🏆" : percent >= 50 ? "💪" : "📚"}
      </div>
      <h2 className="text-5xl font-black text-blue-900 mb-4">Hoàn thành!</h2>
      <p className="text-2xl font-bold text-gray-500 mb-8">Bé làm đúng {score} / {questions.length} câu</p>
      
      <div className="w-full h-8 bg-gray-100 rounded-full mb-10 overflow-hidden p-1 shadow-inner">
         <div 
           className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000" 
           style={{ width: `${percent}%` }}
         ></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setMode('menu')} className="bg-blue-600 text-white py-4 rounded-3xl font-black text-xl hover:bg-blue-700 shadow-lg">VỀ MENU</button>
        <button onClick={() => window.location.reload()} className="bg-white text-blue-600 border-4 border-blue-100 py-4 rounded-3xl font-black text-xl hover:border-blue-200">LÀM LẠI</button>
      </div>
    </div>
  );
}

export function HistoryView() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    getHistoryByDate(selectedDate).then(setItems);
  }, [selectedDate]);

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black text-blue-900">Nhật ký 📊</h2>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={e => setSelectedDate(e.target.value)}
          className="p-3 bg-white border-2 border-blue-400 rounded-2xl font-bold text-blue-600"
        />
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl text-center border-4 border-dashed border-gray-100">
            <p className="text-gray-400 text-xl font-bold italic">Chưa có kết quả cho ngày này. Cố lên bé nhé! 💪</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-3xl flex items-center justify-between shadow-lg border-l-8 border-blue-500">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">
                   {LESSON_TYPES.find(l => l.id === item.type)?.icon}
                </div>
                <div>
                  <h4 className="text-xl font-black text-gray-800">{LESSON_TYPES.find(l => l.id === item.type)?.name}</h4>
                  <p className="text-gray-400 font-bold">{new Date(item.timestamp).toLocaleTimeString('vi-VN')}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-blue-600">{item.score}/{item.total}</div>
                <div className="text-xs font-black text-blue-300 uppercase">Đúng</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
