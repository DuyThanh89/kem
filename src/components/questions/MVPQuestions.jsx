import React, { useState } from 'react';
import { NumberInput } from '../shared/NumberInput';
import { SubmitBar } from '../shared/SubmitBar';
import { formatNumber } from '../../generators/utils';


export function ArithmeticQ({ question, onSubmit, submitted, feedback }) {
  const [val, setVal] = useState("");

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="flex items-center gap-6 text-6xl font-black text-slate-800 tracking-tighter">
        <span>{formatNumber(question.a)}</span>
        <span className="text-blue-500">{question.op}</span>
        <span>{formatNumber(question.b)}</span>
        <span className="text-slate-300">=</span>
      </div>
      
      <NumberInput 
        value={val} 
        onChange={setVal} 
        onKeyDown={(e) => e.key === 'Enter' && val !== "" && onSubmit(Number(val))}
        disabled={submitted} 
        autoFocus 
        size="lg"
      />

      <SubmitBar 
        fields={[val]} 
        submitted={submitted}
        feedback={feedback}
        onSubmit={() => onSubmit(Number(val))} 
      />
    </div>
  );
}

export function ClockReadQ({ question, onSubmit, submitted, feedback }) {
  const [h, setH] = useState("");
  const [m, setM] = useState("");

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="relative w-72 h-72 rounded-full border-[10px] border-slate-800 bg-white shadow-2xl flex items-center justify-center">
        {/* Marks */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="absolute inset-0 p-3" 
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <div className={`mx-auto rounded-full ${i % 3 === 0 ? 'w-1.5 h-5 bg-slate-400' : 'w-1 h-3 bg-slate-200'}`}></div>
          </div>
        ))}

        {/* Hour Hand */}
        <div 
          className="absolute bottom-1/2 left-1/2 w-2.5 bg-slate-800 rounded-full origin-bottom -translate-x-1/2" 
          style={{ 
            height: '25%',
            transform: `translateX(-50%) rotate(${question.h * 30 + question.m * 0.5}deg)` 
          }}
        ></div>

        {/* Minute Hand */}
        <div 
          className="absolute bottom-1/2 left-1/2 w-1.5 bg-blue-500 rounded-full origin-bottom -translate-x-1/2" 
          style={{ 
            height: '38%',
            transform: `translateX(-50%) rotate(${question.m * 6}deg)` 
          }}
        ></div>

        {/* Center Pin */}
        <div className="absolute w-5 h-5 bg-slate-800 rounded-full shadow-md z-10"></div>
        <div className="absolute w-2 h-2 bg-slate-400 rounded-full z-20"></div>
      </div>

      <p className="text-2xl font-black text-slate-600">{question.text}</p>
      
      <div className="flex items-center gap-4 text-4xl font-black">
        <NumberInput 
          value={h} 
          onChange={setH} 
          onKeyDown={(e) => e.key === 'Enter' && h !== "" && m !== "" && onSubmit({ h: Number(h), m: Number(m) })}
          disabled={submitted} 
          placeholder="Giờ" 
        />
        <span>:</span>
        <NumberInput 
          value={m} 
          onChange={setM} 
          onKeyDown={(e) => e.key === 'Enter' && h !== "" && m !== "" && onSubmit({ h: Number(h), m: Number(m) })}
          disabled={submitted} 
          placeholder="Phút" 
        />
      </div>

      <SubmitBar 
        fields={[h, m]} 
        submitted={submitted}
        feedback={feedback}
        onSubmit={() => onSubmit({ h: Number(h), m: Number(m) })} 
      />
    </div>
  );
}

export function WordProblemQ({ question, onSubmit, submitted, feedback }) {
  const [steps, setSteps] = useState(
    question.steps.map(() => ({ text: "", a: "", op: "+", b: "", res: "" }))
  );

  const updateStep = (idx, field, val) => {
    const next = [...steps];
    next[idx][field] = val;
    setSteps(next);
  };

  const isCompleted = steps.every(s => s.text && s.a && s.b && s.res);

  const handleSubmit = () => {
    const isAllCorrect = steps.every((s, i) => {
      const q = question.steps[i];
      if (q.type === 'perimeter_formula') {
        const valA = Number(s.a);
        const valB = Number(s.b);
        // Can be (length + width) or (width + length)
        const isInputsMatch = (valA === q.l && valB === q.w) || (valA === q.w && valB === q.l);
        return isInputsMatch && Number(s.res) === q.result;
      }
      return Number(s.a) === q.a && 
             s.op === q.op && 
             Number(s.b) === q.b && 
             Number(s.res) === q.result;
    });

    if (isAllCorrect) {
      onSubmit(question.answer);
    } else {
      onSubmit(NaN);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4 w-full max-w-3xl mx-auto overflow-y-auto max-h-[70vh] px-4 custom-scrollbar">
      <div className="glass-card p-8 w-full bg-white/90 shadow-xl border-2 border-blue-50">
        <p className="text-2xl font-bold text-slate-700 leading-relaxed text-center">
          {question.text.replace(/\d+/g, (match) => formatNumber(match))}
        </p>
      </div>

      <div className="flex flex-col gap-8 w-full">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col gap-4 p-6 bg-white rounded-[2rem] border-4 border-slate-50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-sm">
                {i + 1}
              </div>
              <input
                type="text"
                placeholder={`Lời giải bước ${i + 1}...`}
                value={step.text}
                onChange={(e) => updateStep(i, 'text', e.target.value)}
                disabled={submitted}
                className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-600 outline-none focus:border-blue-400 focus:bg-white transition-all"
              />
            </div>

            {question.steps[i].type === 'perimeter_formula' ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-black text-slate-300">(</span>
                <NumberInput 
                  value={step.a} 
                  onChange={(v) => updateStep(i, 'a', v)} 
                  disabled={submitted} 
                  size="md" 
                  placeholder="Dài"
                />
                <span className="text-xl font-black text-blue-500">+</span>
                <NumberInput 
                  value={step.b} 
                  onChange={(v) => updateStep(i, 'b', v)} 
                  disabled={submitted} 
                  size="md" 
                  placeholder="Rộng"
                />
                <span className="text-3xl font-black text-slate-300">)</span>
                <span className="text-xl font-black text-blue-500">×</span>
                <span className="text-3xl font-black text-slate-700">2</span>
                <span className="text-3xl font-black text-slate-300">=</span>
                <NumberInput 
                  value={step.res} 
                  onChange={(v) => updateStep(i, 'res', v)} 
                  disabled={submitted} 
                  size="md" 
                  placeholder="?"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <NumberInput 
                  value={step.a} 
                  onChange={(v) => updateStep(i, 'a', v)} 
                  disabled={submitted} 
                  size="md" 
                  placeholder="Số"
                />
                <select
                  value={step.op}
                  onChange={(e) => updateStep(i, 'op', e.target.value)}
                  disabled={submitted}
                  className="bg-blue-50 text-blue-600 font-black text-2xl p-2 rounded-xl border-2 border-blue-100 outline-none cursor-pointer"
                >
                  {['+', '-', '×', '÷'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <NumberInput 
                  value={step.b} 
                  onChange={(v) => updateStep(i, 'b', v)} 
                  disabled={submitted} 
                  size="md" 
                  placeholder="Số"
                />
                <span className="text-3xl font-black text-slate-300">=</span>
                <NumberInput 
                  value={step.res} 
                  onChange={(v) => updateStep(i, 'res', v)} 
                  disabled={submitted} 
                  size="md" 
                  placeholder="?"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <SubmitBar 
        fields={isCompleted ? ['done'] : []} 
        submitted={submitted}
        feedback={feedback}
        onSubmit={handleSubmit} 
      />
    </div>
  );
}

export function FillBlankQ({ question, onSubmit, submitted, feedback }) {
  const [val, setVal] = useState("");
  const formattedEquation = question.equation.replace(/\d+/g, (match) => formatNumber(match));
  const parts = formattedEquation.split("?");

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <p className="text-2xl font-black text-slate-400 uppercase tracking-widest">{question.text}</p>
      
      <div className="flex items-center gap-6 text-6xl font-black text-slate-800">
        <span>{parts[0]}</span>
        <NumberInput 
          value={val} 
          onChange={setVal} 
          onKeyDown={(e) => e.key === 'Enter' && val !== "" && onSubmit(Number(val))}
          disabled={submitted} 
          autoFocus 
          size="md" 
        />
        <span>{parts[1]}</span>
      </div>

      <SubmitBar 
        fields={[val]} 
        submitted={submitted}
        feedback={feedback}
        onSubmit={() => onSubmit(Number(val))} 
      />
    </div>
  );
}

export function CompareQ({ question, onSubmit, submitted, feedback }) {
  const [ans, setAns] = useState("");

  return (
    <div className="flex flex-col items-center gap-12 py-8">
      <p className="text-2xl font-black text-slate-400 uppercase tracking-widest">{question.text}</p>
      
      <div className="flex items-center justify-center gap-6 lg:gap-12 text-4xl lg:text-5xl font-black text-slate-800 w-full px-4">
        <div className="text-center">
          {typeof question.left === 'string' 
            ? question.left.replace(/\d+/g, (match) => formatNumber(match)) 
            : formatNumber(question.left)}
        </div>
        
        <div className="flex flex-col gap-3">
          {['<', '=', '>'].map(op => (
            <button
              key={op}
              onClick={() => !submitted && setAns(op)}
              className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-3xl border-4 transition-all ${
                ans === op 
                  ? "bg-blue-500 border-blue-600 text-white shadow-lg scale-110" 
                  : "bg-white border-slate-100 text-slate-300 hover:border-blue-200"
              }`}
            >
              {op}
            </button>
          ))}
        </div>

        <div className="text-center">
          {typeof question.right === 'string' 
            ? question.right.replace(/\d+/g, (match) => formatNumber(match)) 
            : formatNumber(question.right)}
        </div>
      </div>

      <SubmitBar 
        fields={[ans]} 
        submitted={submitted}
        feedback={feedback}
        onSubmit={() => onSubmit(ans)} 
      />
    </div>
  );
}

