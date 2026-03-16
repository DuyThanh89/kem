import React, { useState } from 'react';
import { SubmitBar } from '../shared/SubmitBar';
import { NumberInput } from '../shared/NumberInput';
import { formatNumber } from '../../generators/utils';


// 1. Shapes (Đếm hình) - Simple SVG drawing
export function ShapesQ({ question, onSubmit, submitted, feedback }) {
  const [val, setVal] = useState("");

  const renderedItems = React.useMemo(() => {
    const items = [];
    let currentIndex = 0;
    
    // Fixed positions to ensure clarity
    const positions = [
      { x: 50, y: 30 }, { x: 150, y: 30 }, { x: 250, y: 30 },
      { x: 100, y: 90 }, { x: 200, y: 90 }, { x: 300, y: 90 },
      { x: 50, y: 150 }, { x: 150, y: 150 }, { x: 250, y: 150 }
    ];

    question.allShapes.forEach(shape => {
      for (let i = 0; i < shape.count; i++) {
        const pos = positions[currentIndex++] || { x: rand(50, 300), y: rand(30, 150) };
        const { x, y } = pos;
        
        if (shape.name === 'hình tam giác') {
          items.push(
            <polygon 
              key={`sh-${currentIndex}`} 
              points={`${x},${y+40} ${x+50},${y+40} ${x+25},${y}`} 
              className="fill-blue-100 stroke-blue-500 stroke-[3]" 
            />
          );
        } else if (shape.name === 'hình tròn') {
          items.push(
            <circle 
              key={`sh-${currentIndex}`} 
              cx={x+25} cy={y+20} r="20" 
              className="fill-yellow-100 stroke-yellow-500 stroke-[3]" 
            />
          );
        } else if (shape.name === 'hình tứ giác') {
          items.push(
            <rect 
              key={`sh-${currentIndex}`} 
              x={x} y={y} width="45" height="40" 
              className="fill-emerald-100 stroke-emerald-500 stroke-[3]" 
            />
          );
        }
      }
    });
    return items;
  }, [question.allShapes]);

  return (
    <div className="flex flex-col items-center gap-8 py-6 text-center w-full">
      <div className="glass-card p-8 w-full max-w-2xl bg-white/80 overflow-hidden relative">
        <svg viewBox="0 0 400 200" className="w-full h-56 bg-white rounded-3xl border-2 border-slate-100 shadow-inner">
          {renderedItems}
        </svg>
        <p className="text-3xl font-black text-slate-800 mt-8 leading-tight">
          {question.text.replace(/\d+/g, (match) => formatNumber(match))}
        </p>
      </div>
      <NumberInput 
        value={val} 
        onChange={setVal} 
        onKeyDown={(e) => e.key === 'Enter' && val !== "" && onSubmit(Number(val))}
        disabled={submitted} 
        autoFocus 
        size="lg" 
      />
      <SubmitBar fields={[val]} submitted={submitted} feedback={feedback} onSubmit={() => onSubmit(Number(val))} />
    </div>
  );
}

// 2. DrawClock (Tương tác xoay kim)
export function DrawClockQ({ question, onSubmit, submitted, feedback }) {
  const [h, setH] = useState(12);
  const [m, setM] = useState(0);

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="text-3xl font-black text-slate-800 mb-4">{question.text}</div>
      
      <div className="relative w-72 h-72 rounded-full border-[10px] border-slate-800 bg-white shadow-2xl flex items-center justify-center">
        {/* Minute Marks (60 dots) */}
        {[...Array(60)].map((_, i) => (
          <div key={i} className="absolute inset-0 p-2" style={{ transform: `rotate(${i * 6}deg)` }}>
            <div className={`mx-auto rounded-full ${i % 5 === 0 ? 'w-1 h-3 bg-slate-400' : 'w-0.5 h-1 bg-slate-200'}`}></div>
          </div>
        ))}

        {/* Hour Hand */}
        <div 
          className="absolute bottom-1/2 left-1/2 w-2.5 bg-slate-800 rounded-full origin-bottom cursor-pointer z-10" 
          style={{ height: '28%', transform: `translateX(-50%) rotate(${h * 30 + (m * 0.5)}deg)` }}
          onClick={() => !submitted && setH((h % 12) + 1)}
        ></div>

        {/* Minute Hand */}
        <div 
          className="absolute bottom-1/2 left-1/2 w-1.5 bg-blue-500 rounded-full origin-bottom cursor-pointer z-10" 
          style={{ height: '40%', transform: `translateX(-50%) rotate(${m * 6}deg)` }}
          onClick={() => !submitted && setM((m + 1) % 60)}
        ></div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-slate-800 rounded-full z-20 shadow-md border-2 border-slate-700"></div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => !submitted && setH((h % 12) + 1)} disabled={submitted} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black text-slate-700 transition-all">+1 Giờ</button>
        <button onClick={() => !submitted && setM((m + 5) % 60)} disabled={submitted} className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-2xl font-black text-blue-600 transition-all">+5 Phút</button>
        <button onClick={() => !submitted && setM((m + 1) % 60)} disabled={submitted} className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-2xl font-black text-white transition-all shadow-lg shadow-blue-200">+1 Phút</button>
      </div>

      <SubmitBar 
        fields={['done']} 
        submitted={submitted} 
        feedback={feedback} 
        onSubmit={() => onSubmit({ h, m })} 
        label="Xong rồi ✓"
      />
    </div>
  );
}

