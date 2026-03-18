import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { formatNumber } from '../../generators/utils';
import { 
  ArithmeticQ, ClockReadQ, WordProblemQ, 
  FillBlankQ, CompareQ 
} from '../questions/MVPQuestions';
import { StandardAdvancedQ, SortingQ } from '../questions/AdvancedQuestions';
import { ShapesQ, DrawClockQ } from '../questions/InteractiveQuestions';

const QUESTION_COMPONENTS = {
  arithmetic: ArithmeticQ,
  clock: ClockReadQ,
  word: WordProblemQ,
  fillBlank: FillBlankQ,
  compare: CompareQ,
  measurement: StandardAdvancedQ,
  money: StandardAdvancedQ,
  sorting: SortingQ,
  pattern: StandardAdvancedQ,
  perimeter: StandardAdvancedQ,
  rounding: StandardAdvancedQ,
  calendar: StandardAdvancedQ,
  duration: StandardAdvancedQ,
  shapes: ShapesQ,
  drawClock: DrawClockQ,
  area: StandardAdvancedQ,
};

export function Quiz() {
  const { 
    questions, current, quizType, submitAnswer, 
    nextQuestion, feedback, streak, score, setMode
  } = useGameStore();

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        nextQuestion();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [feedback, nextQuestion]);
  
  const question = questions[current];
  let QuestionComp = QUESTION_COMPONENTS[quizType] || ArithmeticQ;
  
  // Special case: if a perimeter, area or money question has steps, use WordProblemQ
  if (['perimeter', 'area', 'money'].includes(quizType) && question?.steps) {
    QuestionComp = WordProblemQ;
  }

  const handleLevelSubmit = (userAnswer) => {
    let isCorrect = false;
    
    // Check if component already calculated correctness (e.g., WordProblemQ)
    if (userAnswer && typeof userAnswer === 'object' && 'isCorrect' in userAnswer) {
      isCorrect = userAnswer.isCorrect;
      userAnswer = userAnswer.input; // Extract the actual answer for display
    } else if (quizType === 'clock' || quizType === 'drawClock' || quizType === 'duration') {
      if (typeof question.answer === 'object') {
        isCorrect = userAnswer?.h === question.answer?.h && userAnswer?.m === question.answer?.m;
      } else {
        isCorrect = userAnswer === question.answer;
      }
    } else if (quizType === 'sorting') {
      isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.answer);
    } else {
      isCorrect = userAnswer === question.answer;
    }

    let questionText = question.text;
    if (quizType === 'compare') {
      const leftStr = typeof question.left === 'string' ? question.left.replace(/\d+/g, m => formatNumber(m)) : formatNumber(question.left);
      const rightStr = typeof question.right === 'string' ? question.right.replace(/\d+/g, m => formatNumber(m)) : formatNumber(question.right);
      questionText = `${leftStr} ... ${rightStr}`;
    } else if (quizType === 'fillBlank') {
      questionText = (question.equation || '').replace(/\d+/g, m => formatNumber(m));
    } else if (quizType === 'sorting') {
      questionText = `${question.text} [${(question.options || []).map(n => formatNumber(n)).join(', ')}]`;
    } else if (quizType === 'pattern') {
      questionText = `${question.text} [${(question.sequence || []).map(n => formatNumber(n)).join(', ')}, ?]`;
    } else if (quizType === 'clock') {
      questionText = "Đồng hồ chỉ mấy giờ mấy phút?";
    } else if (quizType === 'drawClock') {
      questionText = question.text;
    }

    submitAnswer(isCorrect, {
      questionId: question.id,
      input: userAnswer,
      correct: question.answer,
      isCorrect,
      questionText,
      equation: question.equation,
      type: quizType,
      options: question.options,
      sequence: question.sequence,
    });
  };

  if (!question) return null;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pt-2 md:pt-4 relative px-4 md:px-0">
      {/* Progress & Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setMode('menu')}
            className="p-2 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors active:scale-95"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="bg-white px-3 md:px-4 py-2 rounded-2xl shadow-sm border border-slate-100 font-black text-blue-600 text-sm md:text-base">
            Câu {current + 1} / {questions.length}
          </div>
          <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100">
            <span className="text-xl">🔥</span>
            <span className="font-black text-orange-600">{streak}</span>
          </div>
        </div>
        
        <div className="font-black text-slate-400 text-lg">
          Điểm: <span className="text-green-500">{score}</span>
        </div>
      </div>

      <div className="progress-bar-bg h-3 mb-4">
        <div 
          className="progress-bar-fill h-full bg-blue-500" 
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="glass-card p-4 md:p-8 lg:p-12 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
        <QuestionComp 
          key={current}
          question={question} 
          onSubmit={handleLevelSubmit} 
          submitted={!!feedback} 
          feedback={feedback}
        />
      </div>
    </div>
  );
}
