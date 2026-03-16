import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { saveQuizToDB, getHistory } from '../db';

export const BADGES = [
  { id: 'first_quiz', title: 'Khởi đầu nan', desc: 'Hoàn thành bài học đầu tiên', icon: '🌱' },
  { id: 'perfect_score', title: 'Tuyệt đối', desc: 'Đạt điểm 10/10', icon: '⭐' },
  { id: 'streak_5', title: 'Phong độ tốt', desc: 'Đạt chuỗi 5 câu đúng', icon: '🔥' },
  { id: 'fast_learner', title: 'Thần tốc', desc: 'Làm đúng 10 bài tập', icon: '⚡' },
];

export const useGameStore = create(
  persist(
    (set, get) => ({
  // Navigation & UI State
  mode: 'menu', // 'menu' | 'quiz' | 'result'
  quizType: null,
  feedback: null, // 'correct' | 'wrong'

  // Quiz Execution State
  questions: [],
  current: 0,
  answers: [], // Array of { questionId, input, correct, isCorrect }

  // Statistics & Gamification
  score: 0,
  streak: 0,
  bestStreak: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  history: [],
  badges: [], // Array of badge IDs

  // Actions
  startQuiz: (type, questions) => set({
    mode: 'quiz',
    quizType: type,
    questions,
    current: 0,
    answers: [],
    score: 0,
    streak: 0,
    feedback: null,
  }),

  submitAnswer: (isCorrect, answerDetail) => {
    const { streak, score, totalAnswered, totalCorrect, bestStreak } = get();
    const newStreak = isCorrect ? streak + 1 : 0;
    
    set({
      feedback: isCorrect ? 'correct' : 'wrong',
      score: isCorrect ? score + 1 : score,
      streak: newStreak,
      bestStreak: Math.max(bestStreak, newStreak),
      totalAnswered: totalAnswered + 1,
      totalCorrect: totalCorrect + (isCorrect ? 1 : 0),
      answers: [...get().answers, answerDetail],
    });
  },

  nextQuestion: async () => {
    const { current, questions, score, quizType, answers } = get();
    if (current + 1 < questions.length) {
      set({
        current: current + 1,
        feedback: null,
      });
    } else {
      // Save to IndexedDB
      await saveQuizToDB({
        type: quizType,
        score: score,
        total: questions.length,
        answers: answers
      });
      
      // Check for badges
      const currentBadges = get().badges;
      const newBadges = [];
      
      if (!currentBadges.includes('first_quiz')) newBadges.push('first_quiz');
      if (score === questions.length && !currentBadges.includes('perfect_score')) newBadges.push('perfect_score');
      if (get().bestStreak >= 5 && !currentBadges.includes('streak_5')) newBadges.push('streak_5');
      if (get().totalAnswered >= 10 && !currentBadges.includes('fast_learner')) newBadges.push('fast_learner');

      set({
        mode: 'result',
        feedback: null,
        history: await getHistory(),
        badges: [...currentBadges, ...newBadges]
      });
    }
  },

  loadHistory: async () => {
    set({ history: await getHistory() });
  },

    setMode: (mode) => set({ mode }),
  }),
  {
    name: 'kem-math-storage',
    partialize: (state) => ({ 
      badges: state.badges, 
      bestStreak: state.bestStreak, 
      totalAnswered: state.totalAnswered, 
      totalCorrect: state.totalCorrect 
    }),
  })
);
