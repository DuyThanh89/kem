import React, { useState, useEffect } from 'react';
import { NumberInput, SubmitBar } from './Shared';

export function ArithmeticQ({ q, onSubmit }) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setValue("");
    setSubmitted(false);
  }, [q]);

  const handleSubmit = () => {
    if (submitted || value === "") return;
    setSubmitted(true);
    const isCorrect = Number(value) === q.answer;
    onSubmit(isCorrect, { inputValue: value, correctValue: q.answer, isCorrect });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl font-black mb-8 text-blue-800 tracking-wider">
        {q.a} {q.op} {q.b} = 
        <span className="ml-4">
          <NumberInput value={value} onChange={setValue} disabled={submitted} autoFocus />
        </span>
      </div>
      
      {submitted && (
        <div className={`text-2xl font-bold mb-4 ${Number(value) === q.answer ? "text-green-500" : "text-red-500"}`}>
          {Number(value) === q.answer ? "⭐ Đúng rồi!" : `💡 Đáp án là: ${q.answer}`}
        </div>
      )}

      <SubmitBar fields={[value]} onSubmit={handleSubmit} submitted={submitted} />
    </div>
  );
}

export function ClockReadQ({ q, onSubmit }) {
  const [h, setH] = useState("");
  const [m, setM] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setH(""); setM(""); setSubmitted(false);
  }, [q]);

  const handleSubmit = () => {
    if (submitted || h === "" || m === "") return;
    setSubmitted(true);
    const isCorrect = Number(h) === q.answerHours && Number(m) === q.answerMinutes;
    onSubmit(isCorrect, { 
      inputValue: `${h}:${m}`, 
      correctValue: `${q.answerHours}:${q.answerMinutes}`, 
      isCorrect 
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 p-4 bg-white rounded-full shadow-inner border-8 border-yellow-400">
        {/* Simple SVG Clock placeholder - in real app would use a library or detailed SVG */}
        <div className="w-48 h-48 rounded-full border-4 border-gray-200 relative flex items-center justify-center font-bold text-xl">
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-black rounded-full z-10"></div>
              {/* Hour hand */}
              <div 
                className="absolute w-1 h-12 bg-black origin-bottom rounded-full" 
                style={{ transform: `rotate(${(q.hours % 12) * 30 + q.minutes * 0.5}deg)`, bottom: '50%' }}
              ></div>
              {/* Minute hand */}
              <div 
                className="absolute w-1 h-16 bg-red-500 origin-bottom rounded-full" 
                style={{ transform: `rotate(${q.minutes * 6}deg)`, bottom: '50%' }}
              ></div>
           </div>
           <span className="absolute top-2">12</span>
           <span className="absolute right-2">3</span>
           <span className="absolute bottom-2">6</span>
           <span className="absolute left-2">9</span>
        </div>
      </div>

      <div className="text-2xl font-bold mb-6 text-gray-700">Đồng hồ chỉ mấy giờ mấy phút?</div>
      
      <div className="flex items-center gap-4 text-xl font-bold">
        <NumberInput value={h} onChange={setH} disabled={submitted} size="sm" placeholder="Giờ" autoFocus />
        <span>giờ</span>
        <NumberInput value={m} onChange={setM} disabled={submitted} size="sm" placeholder="Phút" />
        <span>phút</span>
      </div>

      {submitted && (
        <div className={`text-2xl font-bold mt-6 ${Number(h) === q.answerHours && Number(m) === q.answerMinutes ? "text-green-500" : "text-red-500"}`}>
          {isCorrect ? "🌟 Tuyệt quá!" : `💡 Đáp án: ${q.answerHours} giờ ${q.answerMinutes} phút`}
        </div>
      )}

      <SubmitBar fields={[h, m]} onSubmit={handleSubmit} submitted={submitted} />
    </div>
  );
}
