import React from 'react';
import { useGameStore } from './store/gameStore';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Menu } from './components/layout/Menu';
import { Quiz } from './components/layout/Quiz';
import { Result } from './components/layout/Result';
import { HistoryView } from './components/layout/History';
import { Achievements } from './components/layout/Achievements';

function App() {
  const { mode } = useGameStore();

  return (
    <DashboardLayout>
      {mode === 'menu' && <Menu />}
      {mode === 'quiz' && <Quiz />}
      {mode === 'result' && <Result />}
      {mode === 'history' && <HistoryView />}
      {mode === 'achievements' && <Achievements />}
    </DashboardLayout>
  );
}

export default App;
