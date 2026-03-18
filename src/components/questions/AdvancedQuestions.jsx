import React, { useState, useEffect } from 'react';
import { NumberInput } from '../shared/NumberInput';
import { SubmitBar } from '../shared/SubmitBar';
import { formatNumber } from '../../generators/utils';


// 1. Measurement, Money, Perimeter, Pattern (Standard Number Input)
export function StandardAdvancedQ({ question, onSubmit, submitted, feedback }) {
  const [val, setVal] = useState("");
  const [h, setH] = useState("");
  const [m, setM] = useState("");

  const isComplexDuration = question.type === 'duration_complex';

  return (
    <div className="flex flex-col items-center gap-8 py-6 text-center">
      <div className="glass-card p-10 max-w-2xl bg-white/80">
        <p className="text-3xl font-bold text-slate-700 leading-relaxed mb-4">
          {question.text.replace(/\d+/g, (match) => formatNumber(match))}
        </p>
        {question.sequence && (
          <div className="flex gap-4 justify-center text-5xl font-black text-blue-600 my-6">
            {question.sequence.map((n, i) => (
              <span key={i} className="bg-blue-50 px-4 py-2 rounded-xl">{formatNumber(n)}</span>
            ))}
            <span className="bg-slate-50 px-4 py-2 rounded-xl text-slate-300">?</span>
          </div>
        )}
      </div>

      {isComplexDuration ? (
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <NumberInput 
              value={h} 
              onChange={setH} 
              onKeyDown={(e) => e.key === 'Enter' && h !== "" && m !== "" && onSubmit({ h: Number(h), m: Number(m) })}
              disabled={submitted} 
              autoFocus 
              size="md" 
              placeholder="0"
            />
            <span className="text-xs font-black text-slate-400 uppercase">Giờ</span>
          </div>
          <span className="text-4xl font-black text-slate-300 mb-6">:</span>
          <div className="flex flex-col items-center gap-2">
            <NumberInput 
              value={m} 
              onChange={setM} 
              onKeyDown={(e) => e.key === 'Enter' && h !== "" && m !== "" && onSubmit({ h: Number(h), m: Number(m) })}
              disabled={submitted} 
              size="md" 
              placeholder="0"
            />
            <span className="text-xs font-black text-slate-400 uppercase">Phút</span>
          </div>
        </div>
      ) : (
        <NumberInput 
          value={val} 
          onChange={setVal} 
          onKeyDown={(e) => e.key === 'Enter' && val !== "" && onSubmit(Number(val))}
          disabled={submitted} 
          autoFocus 
          size="lg" 
        />
      )}

      <SubmitBar 
        fields={isComplexDuration ? [h, m] : [val]} 
        submitted={submitted}
        feedback={feedback}
        onSubmit={() => isComplexDuration ? onSubmit({ h: Number(h), m: Number(m) }) : onSubmit(Number(val))} 
      />
      
      {submitted && feedback === 'wrong' && (
        <p className="text-rose-500 font-bold mt-4 animate-bounce">
          Gợi ý: {question.hint}
        </p>
      )}
    </div>
  );
}

// 2. Sorting (Click to order)
export function SortingQ({ question, onSubmit, submitted, feedback }) {
  const [currentOrder, setCurrentOrder] = useState([]);
  const [pool, setPool] = useState(question.options);

  const toggleNum = (num) => {
    if (submitted) return;
    if (currentOrder.includes(num)) {
      setCurrentOrder(currentOrder.filter(n => n !== num));
      setPool([...pool, num]);
    } else {
      setCurrentOrder([...currentOrder, num]);
      setPool(pool.filter(n => n !== num));
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-6 w-full max-w-3xl">
      <div className="text-center">
        <p className="text-3xl font-bold text-slate-700 mb-8">{question.text}</p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center min-h-[100px] p-6 bg-slate-50 rounded-[2rem] border-4 border-dashed border-slate-200 w-full">
        {currentOrder.map((n, i) => (
          <button
            key={i}
            onClick={() => toggleNum(n)}
            className={`h-14 md:h-16 w-fit px-5 whitespace-nowrap rounded-2xl flex items-center justify-center text-lg md:text-xl font-black shadow-lg transform transition-all active:scale-95 ${
              submitted 
                ? (feedback === 'correct' ? 'bg-green-500 text-white' : 'bg-rose-500 text-white')
                : 'bg-blue-500 text-white'
            }`}
          >
            {formatNumber(n)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center w-full">
        {pool.map((n, i) => (
          <button
            key={i}
            onClick={() => toggleNum(n)}
            className="h-14 md:h-16 w-fit px-5 whitespace-nowrap rounded-2xl bg-white border-4 border-slate-100 flex items-center justify-center text-lg md:text-xl font-black text-slate-600 shadow-sm hover:border-blue-300 hover:shadow-md transform transition-all active:scale-95"
          >
            {formatNumber(n)}
          </button>
        ))}
      </div>

      <SubmitBar 
        fields={pool.length === 0 ? ['done'] : []} 
        submitted={submitted}
        feedback={feedback}
        onSubmit={() => onSubmit(currentOrder)}
        label="Sắp xếp xong ✓"
      />
    </div>
  );
}
