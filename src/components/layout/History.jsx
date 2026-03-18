import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  Calendar, History as HistoryIcon, Trophy, Clock, 
  ChevronDown, ChevronUp, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, CalendarDays
} from 'lucide-react';
import { Popover, PopoverButton, PopoverPanel, Transition, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import { formatNumber } from '../../generators/utils';


const TYPE_LABELS = {
  arithmetic: 'Phép tính Cơ bản',
  clock: 'Đọc đồng hồ',
  word: 'Toán đố 2 bước',
  fillBlank: 'Điền số trống',
  compare: 'So sánh số',
  measurement: 'Đơn vị đo lường',
  money: 'Tiền tệ Việt Nam',
  sorting: 'Sắp xếp dãy số',
  pattern: 'Quy luật dãy số',
  perimeter: 'Chu vi hình học',
  area: 'Diện tích hình học',
  shapes: 'Nhận biết hình',
  drawClock: 'Vẽ kim đồng hồ',
  calendar: 'Lịch & Ngày tháng',
  duration: 'Khoảng thời gian',
  rounding: 'Ước lượng & Làm tròn',
};

const SessionModal = ({ isOpen, onClose, session }) => {
  if (!session) return null;

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog onClose={onClose} className="relative z-[60]">
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-2xl transition-all border-4 border-blue-50">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                      <HistoryIcon size={28} />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-black text-slate-800">
                        {TYPE_LABELS[session.type] || session.type}
                      </DialogTitle>
                      <p className="text-slate-400 font-bold">{new Date(session.timestamp).toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                    <X size={24} strokeWidth={3} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-6 rounded-3xl text-center border-2 border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Điểm số</span>
                    <span className="text-3xl font-black text-slate-700">{session.score} / {session.total}</span>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-3xl text-center border-2 border-blue-100">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Chính xác</span>
                    <span className="text-3xl font-black text-blue-600">{Math.round((session.score / session.total) * 100)}%</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Chi tiết từng câu</h4>
                  <div className="grid gap-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {session.answers.map((ans, idx) => (
                      <div key={idx} className={`flex flex-col p-4 rounded-2xl border-2 ${ans.isCorrect ? 'bg-green-50 border-green-100' : 'bg-rose-50 border-rose-100'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {ans.isCorrect ? <CheckCircle size={20} className="text-green-500" /> : <XCircle size={20} className="text-rose-500" />}
                            <span className="font-bold text-slate-700 underline decoration-slate-200 underline-offset-4">Câu {idx + 1}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-tighter">
                             <span className={ans.isCorrect ? 'text-green-600' : 'text-rose-600'}>
                                {ans.isCorrect ? 'Chính xác' : 'Chưa đúng'}
                             </span>
                          </div>
                        </div>

                        <div className="bg-white/50 rounded-xl p-3 mb-3 border border-slate-100/50">
                          <p className="text-slate-600 font-bold leading-relaxed">
                            {ans.questionText || (ans.type === 'arithmetic' ? `${formatNumber(ans.a)} ${ans.op} ${formatNumber(ans.b)} = ?` : 'Câu hỏi đã cũ')}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/40 p-3 rounded-xl border border-white/60">
                            <span className="text-[10px] text-slate-400 uppercase font-black block mb-1">Bé chọn</span>
                            <span className={`text-lg font-black ${ans.isCorrect ? 'text-green-600' : 'text-rose-600'}`}>
                              {Array.isArray(ans.input) 
                                ? ans.input.map(n => formatNumber(n)).join(', ') 
                                : (typeof ans.input === 'object' && ans.input !== null
                                    ? `${ans.input.h}:${ans.input.m}` 
                                    : formatNumber(ans.input))}
                            </span>
                          </div>
                          {!ans.isCorrect && (
                            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                              <span className="text-[10px] text-blue-400 uppercase font-black block mb-1">Đáp án đúng</span>
                              <span className="text-lg font-black text-blue-600">
                                {Array.isArray(ans.correct) 
                                  ? ans.correct.map(n => formatNumber(n)).join(', ') 
                                  : (typeof ans.correct === 'object' && ans.correct !== null
                                      ? `${ans.correct.h}:${ans.correct.m}` 
                                      : formatNumber(ans.correct))}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
const toLocalDateString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CalendarPopup = ({ selectedDate, onSelect }) => {
  const parts = selectedDate.split('-');
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  const [viewDate, setViewDate] = React.useState(new Date(date.getFullYear(), date.getMonth(), 1));
  
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  
  const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const handleMonthChange = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const todayStr = toLocalDateString(new Date());

  return (
    <div className="p-4 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between px-1">
        <button onClick={() => handleMonthChange(-1)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><ChevronLeft size={18} strokeWidth={3} /></button>
        <span className="font-black text-slate-700">{months[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
        <button onClick={() => handleMonthChange(1)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><ChevronRight size={18} strokeWidth={3} /></button>
      </div>

      <div className="grid grid-cols-7 text-center">
        {days.map(d => <span key={d} className="text-[10px] font-black text-slate-300 uppercase py-2">{d}</span>)}
        {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} />)}
        {[...Array(daysInMonth)].map((_, i) => {
          const d = i + 1;
          const currentDayStr = toLocalDateString(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));
          const isSelected = selectedDate === currentDayStr;
          const isToday = todayStr === currentDayStr;
          
          return (
            <button
              key={d}
              onClick={() => onSelect(currentDayStr)}
              className={`h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                isSelected ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 
                isToday ? 'text-blue-500 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export function HistoryView() {
  const { history, loadHistory } = useGameStore();
  const [expandedId, setExpandedId] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(toLocalDateString(new Date()));

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDateChange = (days) => {
    const parts = selectedDate.split('-');
    const current = new Date(parts[0], parts[1] - 1, parts[2]);
    current.setDate(current.getDate() + days);
    setSelectedDate(toLocalDateString(current));
  };

  const isToday = selectedDate === toLocalDateString(new Date());
  const filteredHistory = history.filter(session => session.date === selectedDate);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-10">
      {/* ... header ... content above ... */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Lịch sử Học tập</h1>
          <p className="text-slate-400 font-bold text-lg">Xem lại hành trình vạn dặm của bé 🚀</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            <button 
              onClick={() => handleDateChange(-1)}
              className="p-3 hover:bg-slate-50 text-slate-400 hover:text-blue-500 rounded-xl transition-colors"
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </button>
            
            <div className="px-6 py-2 flex flex-col items-center min-w-[160px]">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-0.5">
                {isToday ? 'Hôm nay' : 'Ngày học'}
              </span>
              
              <Popover className="relative">
                <PopoverButton className="flex items-center gap-2 text-lg font-black text-slate-700 hover:text-blue-600 transition-colors focus:outline-none">
                  {new Date(selectedDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  <CalendarDays size={18} className="text-slate-300" />
                </PopoverButton>

                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <PopoverPanel className="absolute left-1/2 -translate-x-1/2 z-50 mt-3 outline-none">
                    {({ close }) => (
                      <CalendarPopup 
                        selectedDate={selectedDate} 
                        onSelect={(date) => {
                          setSelectedDate(date);
                          close();
                        }} 
                      />
                    )}
                  </PopoverPanel>
                </Transition>
              </Popover>
            </div>

            <button 
              onClick={() => handleDateChange(1)}
              disabled={isToday}
              className={`p-3 rounded-xl transition-colors ${isToday ? 'text-slate-100' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-500'}`}
            >
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 px-6 py-4 rounded-2xl text-white font-black shadow-lg shadow-blue-500/20">
            <Trophy size={20} />
            <span>{filteredHistory.length} bài đã học</span>
          </div>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="glass-card p-24 flex flex-col items-center gap-4 text-slate-400 font-bold italic text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
            <Calendar size={40} className="text-slate-200" />
          </div>
          Bé chưa có bài tập nào trong ngày {selectedDate.split('-').reverse().join('/')}.<br/>
          Hãy chọn ngày khác hoặc bắt đầu học ngay nhé!
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredHistory.map((session) => (
            <div 
              key={session.id} 
              className="glass-card p-6 flex items-center justify-between hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer group"
              onClick={() => setExpandedId(session.id)}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Calendar size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 capitalize">
                    {TYPE_LABELS[session.type] || session.type}
                  </h3>
                  <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                    <span className="flex items-center gap-1">
                       <Clock size={14} /> {new Date(session.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Kết quả</span>
                  <div className="flex items-center gap-2">
                    <Trophy size={20} className="text-yellow-500" />
                    <span className="text-2xl font-black text-slate-700">{formatNumber(session.score)} / {formatNumber(session.total)}</span>
                  </div>
                </div>
                
                <div className="w-24 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-center border border-blue-100 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  Chi tiết
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SessionModal 
        isOpen={expandedId !== null} 
        onClose={() => setExpandedId(null)}
        session={history.find(s => s.id === expandedId)}
      />
    </div>
  );
}
