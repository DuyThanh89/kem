import React from 'react'
import { useStore } from '../store/gameStore'
import { Input } from '@headlessui/react'

export default function MathQuestion({ qid, a, b, index }) {
  const question = useStore(state => state.questions.find(q => q.id === qid))
  const updateAnswer = useStore(state => state.updateAnswer)
  
  if (!question) return null

  const formatNum = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  
  // Decide input color based on correct/incorrect state
  let inputClass = "w-full box-border bg-slate-100 border-none rounded-xl p-3.5 text-xl text-center outline-none transition-all text-slate-900 border-transparent "
  
  if (question.isCorrect === true) {
    inputClass += "ring-2 ring-emerald-500 bg-emerald-50"
  } else if (question.isCorrect === false) {
    inputClass += "ring-2 ring-red-500 bg-red-50"
  } else {
    inputClass += "focus:ring-2 focus:ring-indigo-500 focus:bg-white"
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 relative shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block">
      <div className="absolute top-4 left-4 bg-indigo-50 text-indigo-600 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold">
        {index + 1}
      </div>
      <div className="math-content">
        <div className="block">{formatNum(a)}</div>
        <div className="bottom-num">
          <span className="text-slate-400 font-normal">+</span>
          <span>{formatNum(b)}</span>
        </div>
      </div>
      <Input 
        type="number" 
        className={inputClass}
        placeholder=""
        autoComplete="off"
        value={question.userAnswer}
        onChange={(e) => updateAnswer(qid, e.target.value)}
      />
    </div>
  )
}
