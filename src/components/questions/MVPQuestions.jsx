import React, { useState } from 'react';
import { NumberInput } from '../shared/NumberInput';
import { SubmitBar } from '../shared/SubmitBar';
import { formatNumber } from '../../generators/utils';


export function ArithmeticQ({ question, onSubmit, submitted, feedback }) {
  const [val, setVal] = useState("");

  return (
    <div className="flex flex-col items-center gap-8 py-8 w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row items-end md:items-center justify-center gap-3 md:gap-5 text-4xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tighter w-max md:w-full mx-auto">
        <span className="whitespace-nowrap">{formatNumber(question.a)}</span>
        
        <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-4 md:gap-6">
          <span className="text-blue-500 shrink-0">{question.op}</span>
          <span className="whitespace-nowrap">{formatNumber(question.b)}</span>
        </div>

        {/* Dấu gạch ngang khi đặt tính xếp dọc (ẩn trên máy tính) */}
        <div className="w-full h-1 sm:h-1.5 bg-slate-800 rounded-full md:hidden mt-1 mb-2"></div>
        
        {/* Dấu bằng cho giao diện ngang (ẩn trên điện thoại) */}
        <span className="text-slate-300 shrink-0 hidden md:block">=</span>
        
        <div className="w-full md:w-auto flex justify-end md:block shrink-0">
          <NumberInput 
            value={val} 
            onChange={setVal} 
            onKeyDown={(e) => e.key === 'Enter' && val !== "" && onSubmit(Number(val))}
            disabled={submitted} 
            autoFocus 
            size="lg"
          />
        </div>
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

export function ClockReadQ({ question, onSubmit, submitted, feedback }) {
  const [h, setH] = useState("");
  const [m, setM] = useState("");

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full border-[10px] border-slate-800 bg-white shadow-2xl flex items-center justify-center">
        {/* Minute Marks (60 dots) */}
        {[...Array(60)].map((_, i) => (
          <div key={i} className="absolute inset-0 p-2" style={{ transform: `rotate(${i * 6}deg)` }}>
            <div className={`mx-auto rounded-full ${i % 5 === 0 ? 'w-1 h-3 bg-slate-400' : 'w-0.5 h-1 bg-slate-200'}`}></div>
          </div>
        ))}

        {/* Hour Hand */}
        <div 
          className="absolute bottom-1/2 left-1/2 w-2.5 bg-slate-800 rounded-full origin-bottom z-10" 
          style={{ 
            height: '28%',
            transform: `translateX(-50%) rotate(${question.h * 30 + question.m * 0.5}deg)` 
          }}
        ></div>

        {/* Minute Hand */}
        <div 
          className="absolute bottom-1/2 left-1/2 w-1.5 bg-blue-500 rounded-full origin-bottom z-10" 
          style={{ 
            height: '40%',
            transform: `translateX(-50%) rotate(${question.m * 6}deg)` 
          }}
        ></div>

        {/* Center Pin */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 bg-slate-800 rounded-full z-20 shadow-md border-2 border-slate-700"></div>
      </div>

      <p className="text-xl md:text-2xl font-black text-slate-600">{question.text}</p>
      
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

  const isCompleted = steps.every(s => s.a && s.b && s.res);

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
      const valA = Number(s.a);
      const valB = Number(s.b);
      const valRes = Number(s.res);
      const isCommutative = q.op === '×' || q.op === '+';
      const isDirectMatch = valA === q.a && valB === q.b;
      const isSwappedMatch = isCommutative && valA === q.b && valB === q.a;
      return (isDirectMatch || isSwappedMatch) &&
             s.op === q.op &&
             valRes === q.result;
    });

    const finalInput = Number(steps[steps.length - 1].res);
    onSubmit({
      isCorrect: isAllCorrect,
      input: isAllCorrect ? question.answer : finalInput
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 py-2 w-full max-w-3xl mx-auto ">
      <div className="glass-card p-6 md:p-8 w-full bg-white/90 shadow-xl border-2 border-blue-50">
        <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed text-center">
          {question.text.replace(/\d+/g, (match) => formatNumber(match))}
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col gap-3 p-4 md:p-6 bg-white rounded-[2rem] border-4 border-slate-50 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-sm shrink-0">
                {i + 1}
              </div>
              <input
                type="text"
                placeholder={`Lời giải bước ${i + 1}...`}
                value={step.text}
                onChange={(e) => updateStep(i, 'text', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && isCompleted && handleSubmit()}
                disabled={submitted}
                className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-2 md:py-3 font-bold text-slate-600 text-sm md:text-base outline-none focus:border-blue-400 focus:bg-white transition-all"
              />
            </div>

            {question.steps[i].type === 'perimeter_formula' ? (
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-2">
                {/* Row 1: (a + b) × 2 */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl md:text-3xl font-black text-slate-300">(</span>
                  <NumberInput 
                    value={step.a} 
                    onChange={(v) => updateStep(i, 'a', v)} 
                    onKeyDown={(e) => e.key === 'Enter' && isCompleted && handleSubmit()}
                    disabled={submitted} 
                    size="sm" 
                    placeholder="Dài"
                  />
                  <span className="text-lg font-black text-blue-500">+</span>
                  <NumberInput 
                    value={step.b} 
                    onChange={(v) => updateStep(i, 'b', v)} 
                    onKeyDown={(e) => e.key === 'Enter' && isCompleted && handleSubmit()}
                    disabled={submitted} 
                    size="sm" 
                    placeholder="Rộng"
                  />
                  <span className="text-2xl md:text-3xl font-black text-slate-300">)</span>
                  <span className="text-lg font-black text-blue-500">×</span>
                  <span className="text-2xl font-black text-slate-700">2</span>
                </div>
                {/* Row 2: = result */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl md:text-3xl font-black text-slate-300">=</span>
                  <NumberInput 
                    value={step.res} 
                    onChange={(v) => updateStep(i, 'res', v)} 
                    onKeyDown={(e) => e.key === 'Enter' && isCompleted && handleSubmit()}
                    disabled={submitted} 
                    size="sm" 
                    placeholder="?"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-2">
                {/* Row 1: A op B */}
                <div className="flex items-center justify-center gap-2">
                  <NumberInput 
                    value={step.a} 
                    onChange={(v) => updateStep(i, 'a', v)} 
                    onKeyDown={(e) => e.key === 'Enter' && isCompleted && handleSubmit()}
                    disabled={submitted} 
                    size="sm" 
                    placeholder="Số"
                  />
                  <select
                    value={step.op}
                    onChange={(e) => updateStep(i, 'op', e.target.value)}
                    disabled={submitted}
                    className="bg-blue-50 text-blue-600 font-black text-lg md:text-2xl p-1 md:p-2 rounded-xl border-2 border-blue-100 outline-none cursor-pointer shrink-0"
                  >
                    {['+', '-', '×', '÷'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <NumberInput 
                    value={step.b} 
                    onChange={(v) => updateStep(i, 'b', v)} 
                    onKeyDown={(e) => e.key === 'Enter' && isCompleted && handleSubmit()}
                    disabled={submitted} 
                    size="sm" 
                    placeholder="Số"
                  />
                </div>
                {/* Row 2: = result */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl md:text-3xl font-black text-slate-300">=</span>
                  <NumberInput 
                    value={step.res} 
                    onChange={(v) => updateStep(i, 'res', v)} 
                    onKeyDown={(e) => e.key === 'Enter' && isCompleted && handleSubmit()}
                    disabled={submitted} 
                    size="sm" 
                    placeholder="?"
                  />
                </div>
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
  const part0 = parts[0].trim(); // before ?
  const part1 = parts[1].trim(); // after ?

  // Parse into column arithmetic parts
  let topNum, botOp, botNum, result, inputOnTop;

  if (part0 === "") {
    // Case 2: "? [op] known = result"  → part1 = "- 34 120 = 31 806"
    const match = part1.match(/^([+\-×÷])\s*(.+?)\s*(=.+)$/);
    if (match) {
      topNum = null;         // ? goes on top
      botOp  = match[1];
      botNum = match[2];
      result = match[3];
    } else {
      topNum = null; botOp = ""; botNum = ""; result = part1;
    }
    inputOnTop = true;
  } else {
    // Case 1: "known [op] ? = result" → part0 = "76 942 +"
    const match = part0.match(/^(.+?)\s*([+\-×÷])$/);
    if (match) {
      topNum = match[1];
      botOp  = match[2];
      botNum = null;         // ? goes on bottom
    } else {
      topNum = part0; botOp = ""; botNum = null;
    }
    result = part1; // "= 88 989"
    inputOnTop = false;
  }

  const inputField = (
    <NumberInput 
      value={val} 
      onChange={setVal} 
      onKeyDown={(e) => e.key === 'Enter' && val !== "" && onSubmit(Number(val))}
      disabled={submitted} 
      autoFocus 
      size="md"
    />
  );

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <p className="text-xl sm:text-2xl font-black text-slate-400 uppercase tracking-widest text-center">{question.text}</p>
      
      {/* Mobile: column style */}
      <div className="block md:hidden w-full max-w-xs mx-auto">
        <div className="flex flex-col items-end gap-1 text-3xl sm:text-4xl font-black text-slate-800 tracking-tighter">
          {/* Top row: known number OR input */}
          {inputOnTop
            ? <div className="w-full flex justify-end">{inputField}</div>
            : <span className="whitespace-nowrap">{topNum}</span>
          }
          {/* Bottom row: op + known number OR input */}
          <div className="flex items-center justify-between w-full">
            <span className="text-blue-500 text-2xl shrink-0">{botOp}</span>
            {inputOnTop
              ? <span className="whitespace-nowrap">{botNum}</span>
              : <div>{inputField}</div>
            }
          </div>
          {/* Divider */}
          <div className="w-full h-1 bg-slate-800 rounded-full my-1"></div>
          {/* Result */}
          <span className="whitespace-nowrap">{result}</span>
        </div>
      </div>

      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-center justify-center gap-4 md:gap-6 text-4xl md:text-6xl font-black text-slate-800 w-full">
        <span className="whitespace-nowrap">{parts[0]}</span>
        <NumberInput 
          value={val} 
          onChange={setVal} 
          onKeyDown={(e) => e.key === 'Enter' && val !== "" && onSubmit(Number(val))}
          disabled={submitted} 
          autoFocus 
          size="lg"
        />
        <span className="whitespace-nowrap">{parts[1]}</span>
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
      
      <div className="flex items-center justify-center gap-4 md:gap-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 w-full px-2 md:px-4">
        <div className="text-center whitespace-nowrap">
          {typeof question.left === 'string' 
            ? question.left.replace(/\d+/g, (match) => formatNumber(match)) 
            : formatNumber(question.left)}
        </div>
        
        <select
          value={ans}
          onChange={(e) => !submitted && setAns(e.target.value)}
          disabled={submitted}
          className="bg-blue-50 text-blue-600 font-black text-2xl md:text-3xl px-3 md:px-4 py-2 md:py-3 rounded-2xl border-4 border-blue-100 outline-none cursor-pointer focus:border-blue-500 transition-all shrink-0 appearance-none text-center"
          style={{ minWidth: '4.5rem' }}
        >
          <option value="" disabled>?</option>
          {['<', '=', '>'].map(op => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>

        <div className="text-center whitespace-nowrap">
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

