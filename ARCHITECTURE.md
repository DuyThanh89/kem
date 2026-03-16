# ARCHITECTURE.md --- System Architecture

## High Level Architecture

React SPA

Menu → Quiz → Result

State quản lý bởi Zustand.

Question generators tạo câu hỏi ngẫu nhiên.

    React App
       |
       |-- Layout components
       |-- Question components
       |-- Shared components
       |
       |-- Zustand Store
       |
       |-- Question Generators

## Folder Structure

    src/

    store/
      gameStore.js

    generators/
      arithmetic.js
      clock.js
      word.js
      fillBlank.js
      compare.js
      sortNumbers.js
      pattern.js
      speedDrill.js
      measurement.js
      money.js
      calendar.js
      duration.js
      perimeter.js
      shapes.js
      dragDrop.js
      drawClock.js
      rounding.js

    components/

    layout/
      Menu.jsx
      Quiz.jsx
      Result.jsx

    questions/
      ArithmeticQ.jsx
      ClockReadQ.jsx
      WordProblemQ.jsx
      FillBlankQ.jsx
      CompareQ.jsx
      SortQ.jsx
      PatternQ.jsx
      SpeedDrillQ.jsx
      MeasurementQ.jsx
      MoneyQ.jsx
      CalendarQ.jsx
      DurationQ.jsx
      PerimeterQ.jsx
      ShapesQ.jsx
      DragDropQ.jsx
      DrawClockQ.jsx
      RoundingQ.jsx

    shared/
      NumberInput.jsx
      TimeInput.jsx
      SubmitBar.jsx
      TopBar.jsx
      FeedbackOverlay.jsx

    styles/
      global.css

## Zustand Store

    mode
    quizType
    questions
    current
    answers
    feedback

    score
    streak
    bestStreak
    totalAnswered
    totalCorrect
    history

Actions:

-   startQuiz()
-   submitAnswer()
-   nextQuestion()

## Data Flow

User input → Component → submitAnswer() → Store update → Feedback → Next
question

## Database

IndexedDB using Dexie.

Database: Toan3HocTap

Table: sessions
