import React from 'react';
import { 
  Calculator, Clock, BookOpen, Hash, ArrowLeftRight, Zap, 
  Ruler, Coins, SortAsc, Workflow, Square, Shapes,
  MousePointer2, Move, Calendar, Hourglass, Target, Lock, Plus 
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { generateQuiz } from '../../generators';

const LESSONS = [
  // Giai đoạn 1 - MVP
  { id: 'arithmetic', title: 'Phép tính Cơ bản', subtitle: 'Cộng, Trừ, Nhân, Chia', icon: Calculator, bg: 'bg-blue-500' },
  { id: 'clock', title: 'Đọc đồng hồ', subtitle: 'Xem giờ & phút', icon: Clock, bg: 'bg-green-500' },
  { id: 'word', title: 'Toán đố 2 bước', subtitle: 'Phân tích & giải toán', icon: BookOpen, bg: 'bg-orange-500' },
  { id: 'fillBlank', title: 'Điền số trống', subtitle: 'Tìm số còn thiếu', icon: Hash, bg: 'bg-purple-500' },
  { id: 'compare', title: 'So sánh số', subtitle: 'Dấu <, >, =', icon: ArrowLeftRight, bg: 'bg-rose-500' },
  
  // Giai đoạn 2 - Mở rộng
  { id: 'measurement', title: 'Đơn vị đo lường', subtitle: 'Dài, Cân, Thể tích', icon: Ruler, bg: 'bg-emerald-500' },
  { id: 'money', title: 'Tiền tệ Việt Nam', subtitle: 'Tính tiền & thối lại', icon: Coins, bg: 'bg-amber-500' },
  { id: 'sorting', title: 'Sắp xếp dãy số', subtitle: 'Thứ tự Tăng/Giảm', icon: SortAsc, bg: 'bg-cyan-500' },
  { id: 'pattern', title: 'Quy luật dãy số', subtitle: 'Tìm quy luật logic', icon: Workflow, bg: 'bg-indigo-500' },
  { id: 'perimeter', title: 'Chu vi hình học', subtitle: 'Hình vuông & Chữ nhật', icon: Square, bg: 'bg-teal-500' },
  { id: 'area', title: 'Diện tích hình học', subtitle: 'Đơn vị cm2, m2', icon: Square, bg: 'bg-red-500' },
  { id: 'shapes', title: 'Nhận biết hình', subtitle: 'Đếm tam giác, tứ giác', icon: Shapes, bg: 'bg-violet-500' },

  // Giai đoạn 3 - Nâng cao
  { id: 'drawClock', title: 'Vẽ kim đồng hồ', subtitle: 'Tương tác SVG', icon: MousePointer2, bg: 'bg-pink-500' },
  { id: 'calendar', title: 'Lịch & Ngày tháng', subtitle: 'Tính ngày trong tháng', icon: Calendar, bg: 'bg-fuchsia-500' },
  { id: 'duration', title: 'Khoảng thời gian', subtitle: 'Số giờ đã trôi qua', icon: Hourglass, bg: 'bg-sky-500' },
  { id: 'rounding', title: 'Ước lượng & Làm tròn', subtitle: 'Hàng chục, trăm, nghìn', icon: Target, bg: 'bg-lime-500' },
];

const CourseCard = ({ lesson, isLocked, onClick }) => (
  <div 
    onClick={!isLocked ? onClick : undefined}
    className={`course-card flex flex-col gap-4 relative z-10 ${isLocked ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95 transition-all duration-200'}`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl ${lesson.bg} flex items-center justify-center text-white shadow-lg`}>
        <lesson.icon size={28} strokeWidth={2.5} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-black text-slate-800 leading-tight">{lesson.title}</h3>
        <p className="text-sm font-bold text-slate-400">{lesson.subtitle}</p>
      </div>
    </div>
  </div>
);


export function Menu() {
  const { startQuiz } = useGameStore();

  const handleStart = (lesson) => {
    const questions = generateQuiz(lesson.id, 10);
    startQuiz(lesson.id, questions);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {LESSONS.map((lesson) => (
          <CourseCard 
            key={lesson.id} 
            lesson={lesson} 
            isLocked={false}
            onClick={() => handleStart(lesson)}
          />
        ))}
      </div>
    </div>
  );
}
