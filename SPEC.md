# SPEC.md --- Toán Lớp 3 Web App

## Product Overview

Ứng dụng web giúp học sinh lớp 3 (8--9 tuổi) luyện toán tại nhà.

**Platform:** Web SPA\
**Stack:** React + Vite + Zustand\
**Storage:** IndexedDB (Dexie)\
**Mode:** Menu → Quiz → Result

## Core Learning Philosophy

-   Học sinh **tự tính và tự nhập đáp án**
-   Không dùng multiple choice (ngoại trừ `< > =`)
-   Input tự do giúp rèn phản xạ toán học

## Input Types

  Dạng bài     Input
  ------------ -----------------
  Phép tính    number input
  Đồng hồ      hours + minutes
  So sánh      `< > =`
  Sắp xếp      click-to-place
  Quy luật     number
  Bảng nhân    number + timer
  Kéo thả      drag & drop
  Vẽ đồng hồ   SVG interaction

## Question Schema

    {
      type: string,
      ...fields,
      answer: any
    }

Không có field `choices`.

## Quiz Flow

Menu → Chọn loại bài\
Quiz → Sinh câu hỏi ngẫu nhiên\
Result → Hiển thị điểm và streak

Sau khi nộp: 1. Hiển thị feedback 2. Chờ 1.5s 3. Chuyển câu

## Gamification

-   Streak
-   Best streak
-   Badge achievements
-   Feedback emoji

## Storage

Dùng IndexedDB để lưu session học.

Fields:

-   date
-   type
-   score
-   total
-   answers
-   timestamp

## UX Rules (8--9 tuổi)

-   Font ≥ 18px
-   Input ≥ 44px
-   Auto-focus input
-   Disable submit khi chưa nhập
-   Không trừ điểm
-   Hiển thị đáp án khi sai
