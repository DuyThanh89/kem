# TASKS.md --- Implementation Roadmap

## Stage 1 --- Project Setup

Tasks

1.  [x] Create Vite React project
2.  [x] Setup folder structure
3.  [x] Setup global CSS (Tailwind 4 + Custom Tokens)
4.  [x] Install dependencies (Zustand, Dexie, Lucide, etc.)

Dependencies

-   react
-   zustand
-   dexie

Success Criteria

-   project builds
-   dev server runs

------------------------------------------------------------------------

## Stage 2 --- Core Architecture

Tasks

1.  [x] Implement Zustand store (`src/store/gameStore.js`)
2.  [x] Implement quiz state
3.  [x] Implement basic actions (startQuiz, submitAnswer, nextQuestion)

Files

store/gameStore.js

Success Criteria

-   quiz state updates correctly

------------------------------------------------------------------------

## Stage 3 --- Shared Components

Tasks

1.  [x] NumberInput (Children-friendly design)
2.  [ ] TimeInput
3.  [x] SubmitBar (Gradient & Shadow styling)
4.  [ ] FeedbackOverlay
5.  [x] TopBar (Search & Avatar)
6.  [x] Sidebar (Navigation links)

Success Criteria

-   inputs reusable
-   submit button disabled when empty

------------------------------------------------------------------------

## Stage 4 --- [x] MVP Question Generators

Implement generators:

-   [x] arithmetic
-   [x] clock
-   [x] word
-   [x] fillBlank
-   [x] compare
-   [x] speedDrill

Success Criteria

-   generator returns valid question
-   no negative results

------------------------------------------------------------------------

## Stage 5 --- [x] MVP Question Components

Components:

-   [x] ArithmeticQ
-   [x] ClockReadQ
-   [x] WordProblemQ
-   [x] FillBlankQ
-   [x] CompareQ
-   [x] SpeedDrillQ

Success Criteria

-   inputs render
-   answers validated

------------------------------------------------------------------------

## Stage 6 --- [x] Quiz Flow

Tasks

1.  [x] Menu screen (Connected to generator)
2.  [x] Quiz screen (Feedback & Navigation)
3.  [x] Result screen (Confetti & Summary)
4.  [x] question navigation (Auto score & progress)

Success Criteria

-   quiz completes correctly

------------------------------------------------------------------------

## Stage 7 --- [x] IndexedDB

Tasks

1.  [x] Setup Dexie DB (`src/db/index.js`)
2.  [x] Save quiz sessions (Auto-save on finish)
3.  [x] Load history (Display in `HistoryView`)

Success Criteria

-   sessions stored

------------------------------------------------------------------------

## Stage 8 --- Gamification [DONE]

Tasks

- [x] streak logic
- [x] best streak
- [x] feedback messages
- [x] badges

------------------------------------------------------------------------

## Stage 9 --- Advanced Questions [DONE]

Implement:

- [x] measurement
- [x] money
- [x] sorting
- [x] patterns
- [x] perimeter
- [x] shapes
- [x] drag drop
- [x] draw clock
- [x] calendar
- [x] duration
- [x] rounding

------------------------------------------------------------------------

## Stage 10 --- QA & Polish [DONE]

Checklist

- [x] no console errors
- [x] mobile layout works (Sidebar toggle added)
- [x] generator tested & refined
- [x] no invalid math (Shapes logic fixed)
