import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
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
};

export function Quiz() {
  const { 
    questions, current, quizType, submitAnswer, 
    nextQuestion, feedback, streak, score 
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
  
  // Special case: if a perimeter question has steps, use WordProblemQ
  if (quizType === 'perimeter' && question?.steps) {
    QuestionComp = WordProblemQ;
  }

  const handleLevelSubmit = (userAnswer) => {
    let isCorrect = false;
    
    if (quizType === 'clock' || quizType === 'drawClock' || quizType === 'duration') {
      if (typeof question.answer === 'object') {
        isCorrect = userAnswer.h === question.answer.h && userAnswer.m === question.answer.m;
      } else {
        isCorrect = userAnswer === question.answer;
      }
    } else if (quizType === 'sorting') {
      isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.answer);
    } else {
      isCorrect = userAnswer === question.answer;
    }

    submitAnswer(isCorrect, {
      questionId: question.id,
      input: userAnswer,
      correct: question.answer,
      isCorrect,
      questionText: question.text,
      equation: question.equation,
      type: quizType
    });
  };

  if (!question) return null;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pt-4 relative">
      {/* Progress & Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 font-black text-blue-600">
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
      <div className="glass-card p-12 min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden">
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
