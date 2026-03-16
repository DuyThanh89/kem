# Hướng Dẫn Phát Triển Phần Mềm Học Toán Lớp 3

> **Phiên bản:** 2.0  
> **Đối tượng:** Học sinh lớp 3 tự học tại nhà (web)  
> **Stack:** React + Zustand (inline store) + Vite  
> **Cập nhật lần cuối:** 2026-03  
> **Thay đổi v2.0:** Toàn bộ bài tập chuyển sang nhập liệu tự do — không còn nút chọn đáp án

---

## Triết Lý Thiết Kế Nhập Liệu

> **Nguyên tắc cốt lõi:** Học sinh phải tự tính và tự gõ đáp án — không được đoán mò từ danh sách cho sẵn.

### Tại sao không dùng multiple choice?

| Multiple choice | Input tự do |
|----------------|-------------|
| Có thể đoán ngẫu nhiên (25%) | Phải tính đúng mới ra kết quả |
| Não nhận dạng, không tính toán | Não thực sự xử lý bài toán |
| Dễ bị ảnh hưởng bởi đáp án nhiễu | Tư duy độc lập hoàn toàn |
| Không rèn được kỹ năng viết số | Luyện phản xạ gõ số |

### Nguyên tắc chọn loại input

| Đáp án dạng | Input sử dụng | Ví dụ |
|------------|--------------|-------|
| Số nguyên | `<input type="number">` | 27 + 15 = **?** |
| Chọn 1 trong 3 ký tự | 3 nút lớn inline | **?** ∈ {`<`, `>`, `=`} |
| Thứ tự / xếp hạng | Click-to-place (không drag) | Sắp xếp dãy số |
| Giờ:phút | 2 input liền nhau `HH` `:` `MM` | Đọc đồng hồ → 8 giờ 30 phút |
| Vị trí trực quan | Tương tác trực tiếp trên SVG | Vẽ kim đồng hồ |
| Kéo thả | Drag & drop tiles | Ghép phép tính |
| Nhiều trường | Nhiều input theo bố cục bài | Toán đố 2 bước |

### Quy tắc UX bắt buộc cho mọi input

- **Auto-focus** vào ô đầu tiên khi câu mới xuất hiện
- **Nút xác nhận** bị `disabled` cho đến khi điền đủ tất cả ô bắt buộc
- **Nhấn Enter** = xác nhận (trên desktop)
- **Hiển thị đáp án đúng** ngay sau khi nộp sai, kèm màu đỏ highlight ô sai
- **Không cho sửa** sau khi đã nộp — chuyển câu tiếp sau 1.5s
- **Tắt spinner** trên `input[type=number]` (`-webkit-appearance: none`)

---

## Mục Lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Cấu trúc dự án](#2-cấu-trúc-dự-án)
3. [Hệ thống Store (Zustand)](#3-hệ-thống-store-zustand)
4. [Shared Components — Input](#4-shared-components--input)
5. [Lộ trình phát triển](#5-lộ-trình-phát-triển)
6. [Hướng dẫn chi tiết từng loại bài tập](#6-hướng-dẫn-chi-tiết-từng-loại-bài-tập)
   - 6.1 [Phép tính cơ bản](#61-phép-tính-cơ-bản)
   - 6.2 [Đọc đồng hồ](#62-đọc-đồng-hồ)
   - 6.3 [Toán đố 2 bước](#63-toán-đố-2-bước)
   - 6.4 [Điền số vào chỗ trống](#64-điền-số-vào-chỗ-trống)
   - 6.5 [So sánh và điền dấu](#65-so-sánh-và-điền-dấu)
   - 6.6 [Sắp xếp dãy số](#66-sắp-xếp-dãy-số)
   - 6.7 [Tìm quy luật dãy số](#67-tìm-quy-luật-dãy-số)
   - 6.8 [Bảng nhân — Speed Drill](#68-bảng-nhân--speed-drill)
   - 6.9 [Đổi đơn vị đo lường](#69-đổi-đơn-vị-đo-lường)
   - 6.10 [Bài toán tiền tệ](#610-bài-toán-tiền-tệ)
   - 6.11 [Đọc lịch và tính ngày](#611-đọc-lịch-và-tính-ngày)
   - 6.12 [Tính khoảng thời gian](#612-tính-khoảng-thời-gian)
   - 6.13 [Chu vi hình học](#613-chu-vi-hình-học)
   - 6.14 [Nhận biết hình](#614-nhận-biết-hình)
   - 6.15 [Kéo thả ghép phép tính](#615-kéo-thả-ghép-phép-tính)
   - 6.16 [Vẽ kim đồng hồ](#616-vẽ-kim-đồng-hồ)
   - 6.17 [Ước lượng và làm tròn](#617-ước-lượng-và-làm-tròn)
7. [Hệ thống Gamification](#7-hệ-thống-gamification)
8. [UX cho trẻ em 8–9 tuổi](#8-ux-cho-trẻ-em-89-tuổi)
9. [Quy ước code](#9-quy-ước-code)
10. [Hệ thống Lưu trữ Kết quả (IndexedDB)](#10-hệ-thống-lưu-trữ-kết-quả-indexeddb)
11. [Giao diện Xem lại Lịch sử](#11-giao-diện-xem-lại-lịch-sử)
12. [KPI và đánh giá chất lượng](#12-kpi-và-đánh-giá-chất-lượng)

---

## 1. Tổng Quan Kiến Trúc

```
┌─────────────────────────────────────────────────────────┐
│                      React App (SPA)                    │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Menu    │  │  Quiz    │  │  Result  │  (modes)    │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Zustand Store (inline)              │   │
│  │  mode · quizType · questions · current · score  │   │
│  │  streak · bestStreak · feedback · answers       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Question Generators (pure functions)   │  │
│  │  makeArithmetic · makeClock · makeWord · ...     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Nguyên tắc thiết kế

- **Mỗi loại bài tập = 1 generator function** trả về object câu hỏi chuẩn hoá
- **Mỗi loại bài tập = 1 UI component** render câu hỏi + nhận input
- **Store là nguồn sự thật duy nhất** — component không giữ state bài thi
- **Câu hỏi được sinh ngẫu nhiên** mỗi lần bắt đầu — không dùng database tĩnh
- **Không có `choices` trong generator** — schema câu hỏi chỉ chứa đáp án đúng

---

## 2. Cấu Trúc Dự Án

```
src/
├── main.jsx
├── App.jsx
│
├── store/
│   └── gameStore.js
│
├── generators/
│   ├── arithmetic.js
│   ├── clock.js
│   ├── word.js
│   ├── fillBlank.js
│   ├── compare.js
│   ├── sortNumbers.js
│   ├── pattern.js
│   ├── speedDrill.js
│   ├── measurement.js
│   ├── money.js
│   ├── calendar.js
│   ├── duration.js
│   ├── perimeter.js
│   ├── shapes.js          # danh sách tĩnh SHAPE_PUZZLES
│   ├── dragDrop.js
│   ├── drawClock.js
│   └── rounding.js
│
├── components/
│   ├── layout/
│   │   ├── Menu.jsx
│   │   ├── Quiz.jsx
│   │   └── Result.jsx
│   │
│   ├── questions/
│   │   ├── ArithmeticQ.jsx      # input number
│   │   ├── ClockReadQ.jsx       # input giờ + phút
│   │   ├── WordProblemQ.jsx     # multi-step input
│   │   ├── FillBlankQ.jsx       # input number inline
│   │   ├── CompareQ.jsx         # 3 nút < > =
│   │   ├── SortQ.jsx            # click-to-place
│   │   ├── PatternQ.jsx         # input number
│   │   ├── SpeedDrillQ.jsx      # input number + timer
│   │   ├── MeasurementQ.jsx     # input number + đơn vị
│   │   ├── MoneyQ.jsx           # input number (VNĐ)
│   │   ├── CalendarQ.jsx        # click ngày trên lịch
│   │   ├── DurationQ.jsx        # input giờ + phút
│   │   ├── PerimeterQ.jsx       # input number + đơn vị
│   │   ├── ShapesQ.jsx          # input number
│   │   ├── DragDropQ.jsx        # drag & drop tiles
│   │   ├── DrawClockQ.jsx       # drag kim SVG
│   │   └── RoundingQ.jsx        # input number
│   │
│   └── shared/
│       ├── ClockFace.jsx        # SVG đồng hồ tĩnh
│       ├── DrawableClock.jsx    # SVG đồng hồ tương tác (kéo kim)
│       ├── NumberInput.jsx      # input number chuẩn hoá (reuse)
│       ├── TimeInput.jsx        # input giờ:phút (reuse)
│       ├── SubmitBar.jsx        # nút xác nhận + trạng thái disabled
│       ├── StepInput.jsx        # 1 bước toán đố
│       ├── TopBar.jsx
│       └── FeedbackOverlay.jsx
│
└── styles/
    └── global.css
```

---

## 3. Hệ Thống Store (Zustand)

### Schema đầy đủ

```javascript
const store = createStore({
  mode: "menu",          // "menu" | "quiz" | "result"
  quizType: null,

  questions: [],
  current: 0,
  answers: [],           // [{inputValue, correctValue, isCorrect, timeTaken}]
  feedback: null,        // null | "correct" | "wrong"

  score: 0,
  streak: 0,
  bestStreak: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  history: [],           // Dữ liệu từ IndexedDB (load khi vào màn hình lịch sử)
});
```

### Actions chuẩn

```javascript
function startQuiz(type, count) {
  const questions = generateQuestions(type, count);
  store.setState({
    mode: "quiz", quizType: type, questions,
    current: 0, answers: [], score: 0, streak: 0, feedback: null,
  });
}

// submitAnswer nhận boolean — component tự tính đúng/sai
function submitAnswer(isCorrect) {
  store.setState(s => {
    const ns = isCorrect ? s.streak + 1 : 0;
    return {
      feedback: isCorrect ? "correct" : "wrong",
      score: isCorrect ? s.score + 1 : s.score,
      streak: ns,
      bestStreak: Math.max(s.bestStreak, ns),
      totalAnswered: s.totalAnswered + 1,
      totalCorrect: s.totalCorrect + (isCorrect ? 1 : 0),
    };
  });
  setTimeout(() => {
    store.setState(s => {
      const next = s.current + 1;
      if (next >= s.questions.length) {
        // Tự động lưu vào IndexedDB khi kết thúc bài
        saveQuizToDB({
          type: s.quizType,
          score: s.score,
          total: s.questions.length,
          answers: s.answers
        });
        return { mode: "result", feedback: null };
      }
      return { current: next, feedback: null };
    });
  }, 1500);
}
```

### Schema object câu hỏi (chuẩn hoá — v2.0)

```javascript
{
  type: string,     // khớp tên generator
  // ...fields riêng của từng loại...
  answer: any,      // đáp án đúng để so sánh — KHÔNG có field "choices"
}
```

---

## 4. Shared Components — Input

### `<NumberInput>` — dùng lại cho mọi ô nhập số

```jsx
// props: value, onChange, disabled, autoFocus, placeholder, min, max, size
export function NumberInput({ value, onChange, disabled, autoFocus, placeholder = "?", size = "md" }) {
  const sizes = { sm: "60px", md: "80px", lg: "110px" };
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      autoFocus={autoFocus}
      placeholder={placeholder}
      style={{
        width: sizes[size],
        padding: "10px 8px",
        textAlign: "center",
        fontFamily: "'Baloo 2', cursive",
        fontWeight: 800,
        fontSize: size === "lg" ? "1.6rem" : "1.3rem",
        border: "2.5px solid #3b82f6",
        borderRadius: 12,
        outline: "none",
        WebkitAppearance: "none",
        MozAppearance: "textfield",
      }}
    />
  );
}
```

### `<TimeInput>` — nhập giờ:phút

```jsx
// Render: [__] giờ [__] phút  với 2 ô input riêng
export function TimeInput({ hours, minutes, onChangeHours, onChangeMinutes, disabled }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <NumberInput value={hours} onChange={onChangeHours} disabled={disabled}
        placeholder="?" size="sm" autoFocus />
      <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>giờ</span>
      <NumberInput value={minutes} onChange={onChangeMinutes} disabled={disabled}
        placeholder="?" size="sm" />
      <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>phút</span>
    </div>
  );
}
```

### `<SubmitBar>` — nút xác nhận dùng chung

```jsx
// Tự động disabled nếu bất kỳ field nào trong `fields` còn rỗng
export function SubmitBar({ fields, onSubmit, submitted }) {
  const canSubmit = !submitted && fields.every(f => String(f).trim() !== "");
  return (
    <button onClick={onSubmit} disabled={!canSubmit} style={{
      marginTop: 16, width: "100%", padding: "14px",
      background: canSubmit ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "#e2e8f0",
      color: canSubmit ? "#fff" : "#94a3b8",
      border: "none", borderRadius: 16, cursor: canSubmit ? "pointer" : "not-allowed",
      fontFamily: "'Baloo 2', cursive", fontSize: "1.05rem", fontWeight: 700,
    }}>
      {submitted ? "Đã nộp" : "Xác nhận ✓"}
    </button>
  );
}
```

---

## 5. Lộ Trình Phát Triển

### Giai đoạn 1 — MVP (Tháng 1–3)

| STT | Loại bài | Loại input | Ghi chú |
|-----|----------|-----------|---------|
| 1 | Phép tính cơ bản | `input number` | Cập nhật từ multiple choice |
| 2 | Đọc đồng hồ | `input giờ + phút` | Cập nhật từ multiple choice |
| 3 | Toán đố 2 bước | Multi-step input | Đã có |
| 4 | Điền số vào chỗ trống | `input number` inline | Ít code |
| 5 | So sánh & điền dấu | 3 nút `< > =` | Ngoại lệ hợp lý (chỉ 3 giá trị) |
| 6 | Bảng nhân speed drill | `input number` + timer | Chỉ thêm timer |

### Giai đoạn 2 — Mở rộng (Tháng 4–6)

| STT | Loại bài | Loại input | Ghi chú |
|-----|----------|-----------|---------|
| 7 | Đổi đơn vị đo lường | `input number` | |
| 8 | Bài toán tiền tệ | `input number` (VNĐ) | |
| 9 | Sắp xếp dãy số | Click-to-place | |
| 10 | Tìm quy luật dãy số | `input number` | |
| 11 | Chu vi hình học | `input number` + đơn vị | |
| 12 | Nhận biết hình | `input number` | |

### Giai đoạn 3 — Tương tác cao (Tháng 7–9)

| STT | Loại bài | Loại input | Ghi chú |
|-----|----------|-----------|---------|
| 13 | Vẽ kim đồng hồ | Kéo kim SVG | Độc đáo |
| 14 | Kéo thả ghép phép tính | Drag & drop | |
| 15 | Đọc lịch & tính ngày | Click trên lịch | |
| 16 | Tính khoảng thời gian | `input giờ + phút` | |
| 17 | Ước lượng & làm tròn | `input number` | |

---

## 6. Hướng Dẫn Chi Tiết Từng Loại Bài Tập

---

### 6.1 Phép Tính Cơ Bản

**Mô tả:** Học sinh nhìn phép tính và tự gõ kết quả vào ô input.

**Nội dung:** Cộng (đến 100), Trừ (đến 100), Nhân (bảng nhân 2–9), Chia (kết quả nguyên, chia hết).

**Schema câu hỏi:**
```javascript
{
  type: "arithmetic",
  a: 27, op: "×", b: 4,
  text: "27 × 4 = ?",
  answer: 108,
  // không có "choices"
}
```

**Logic sinh câu hỏi:**
```javascript
function makeArithmetic() {
  const op = ["+", "-", "×", "÷"][randInt(0, 3)];
  let a, b, answer;
  if (op === "+") { a = randInt(1, 99); b = randInt(1, 99 - a); answer = a + b; }
  if (op === "-") { a = randInt(10, 99); b = randInt(1, a); answer = a - b; }
  if (op === "×") { a = randInt(2, 9); b = randInt(2, 9); answer = a * b; }
  if (op === "÷") { b = randInt(2, 9); answer = randInt(2, 9); a = b * answer; }
  return { type: "arithmetic", a, op, b, text: `${a} ${op} ${b} = ?`, answer };
}
```

**UI:**
```
┌──────────────────────────────┐
│     27  ×  4  =  [ ___ ]    │  ← input number, auto-focus
│                  [Xác nhận]  │  ← disabled cho đến khi có giá trị
└──────────────────────────────┘
```

**Feedback sau nộp:**
- Đúng: ô input chuyển xanh lá, feedback overlay "⭐ Đúng rồi!"
- Sai: ô input chuyển đỏ, hiển thị đáp án đúng ngay dưới ô (`= 108`)

**Điểm:** +1 nếu đúng.

---

### 6.2 Đọc Đồng Hồ

**Mô tả:** Học sinh nhìn đồng hồ SVG và tự gõ giờ + phút vào 2 ô input riêng.

**Nội dung:** Kim phút dừng ở bước 5 phút (0, 5, 10, ... 55). Giờ từ 1–12.

**Schema câu hỏi:**
```javascript
{
  type: "clock",
  hours: 8,
  minutes: 30,
  answerHours: 8,
  answerMinutes: 30,
  text: "Đồng hồ chỉ mấy giờ mấy phút?",
}
```

**Logic sinh câu hỏi:**
```javascript
const MINUTE_STEPS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function makeClock() {
  const h = randInt(1, 12);
  const m = MINUTE_STEPS[randInt(0, 11)];
  return { type: "clock", hours: h, minutes: m, answerHours: h, answerMinutes: m,
           text: "Đồng hồ chỉ mấy giờ mấy phút?" };
}
```

**UI:**
```
┌──────────────────────────────────┐
│   [SVG đồng hồ 180×180]          │
│                                  │
│   Đồng hồ chỉ mấy giờ mấy phút? │
│   [ ___ ] giờ  [ ___ ] phút      │  ← 2 input riêng
│   [     Xác nhận ✓     ]         │
└──────────────────────────────────┘
```

**Logic chấm điểm:**
```javascript
const isCorrect = Number(inputHours) === q.answerHours
               && Number(inputMinutes) === q.answerMinutes;
```

**Feedback sau nộp:**
- Highlight riêng từng ô: ô giờ sai → đỏ, ô phút sai → đỏ
- Hiển thị đáp án đúng: `✓ 8 giờ 30 phút`

**Điểm:** +1 nếu cả giờ lẫn phút đều đúng.

---

### 6.3 Toán Đố 2 Bước

**Mô tả:** Học sinh đọc bài toán, tự đặt tên phép tính và điền kết quả cho từng bước.

**Nội dung:** 4 dạng đề: mua bán, phân chia, tích luỹ, đo lường thực tế.

**Schema câu hỏi:**
```javascript
{
  type: "word",
  story: "Lan có 24 quyển sách. Mẹ mua thêm 18 quyển. Sau đó Lan cho bạn 7 quyển.",
  question: "Hỏi Lan còn lại bao nhiêu quyển sách?",
  steps: [
    { label: "Số sách Lan có tất cả", num1: 24, op: "+", num2: 18, result: 42 },
    { label: "Số sách Lan còn lại",   num1: 42, op: "-", num2: 7,  result: 35 },
  ],
  answer: 35,
}
```

**UI mỗi bước:**
```
┌─ Bước 1 ─────────────────────────────────────────┐
│  Tên phép tính:                                   │
│  [______________________________________]  ← text │
│                                                   │
│  Phép tính:                                       │
│  [ 24 ]  [ + ]  [ 18 ]  =  [ ___ ]  ← number    │
└───────────────────────────────────────────────────┘
```

**Logic chấm điểm:**
- Tên phép tính (`label`): chỉ kiểm tra **không rỗng** — không chấm điểm nội dung
- Kết quả số: `Number(input) === step.result`
- **Điểm +1 chỉ khi cả 2 ô kết quả số đều đúng**
- Sau nộp: hiển thị ✅/❌ cho từng bước + đáp án mẫu nếu sai

---

### 6.4 Điền Số Vào Chỗ Trống

**Mô tả:** Phép tính có một số bị ẩn, học sinh điền số còn thiếu.

**Nội dung:** Ẩn số thứ nhất, thứ hai, hoặc kết quả. Với `-` và `÷` chỉ ẩn kết quả hoặc số bị trừ/bị chia.

**Schema câu hỏi:**
```javascript
{
  type: "fillBlank",
  parts: [45, "+", null, "=", 72],  // null = ô trống
  blankPosition: 2,                  // index trong mảng parts
  answer: 27,
}
```

**Logic sinh câu hỏi:**
```javascript
function makeFillBlank() {
  const base = makeArithmetic();
  // Với + và × : ẩn ngẫu nhiên a, b, hoặc result
  // Với - và ÷ : chỉ ẩn result (tránh học sinh phải làm tính ngược phức tạp)
  const canHideAll = ["+", "×"].includes(base.op);
  const positions = canHideAll ? ["a", "b", "result"] : ["result"];
  const pos = positions[randInt(0, positions.length - 1)];

  const parts = [base.a, base.op, base.b, "=", base.answer];
  const blankIndex = { a: 0, b: 2, result: 4 }[pos];
  parts[blankIndex] = null;

  return {
    type: "fillBlank",
    parts,
    blankPosition: blankIndex,
    answer: pos === "result" ? base.answer : pos === "a" ? base.a : base.b,
  };
}
```

**UI — inline với phép tính:**
```
  [ 45 ]  +  [ ___ ]  =  [ 72 ]
              ↑ input number, auto-focus
```

Các số không phải ô trống hiển thị dạng thẻ tĩnh cùng phong cách.

**Điểm:** +1 nếu đúng.

---

### 6.5 So Sánh và Điền Dấu

**Mô tả:** Học sinh chọn dấu thích hợp giữa hai biểu thức.

> **Ngoại lệ hợp lý:** Bài này dùng 3 nút `<`, `>`, `=` vì chỉ có đúng 3 khả năng — không phải "đoán mò" mà là "chọn đúng sau khi tính".

**Nội dung:** So sánh hai số, số với biểu thức, hoặc hai biểu thức.

**Schema câu hỏi:**
```javascript
{
  type: "compare",
  leftExpr: "3 × 8",   rightExpr: "25",
  leftValue: 24,        rightValue: 25,
  answer: "<",
}
```

**Logic sinh câu hỏi:**
```javascript
function makeCompare() {
  const type = ["num_num", "expr_num", "expr_expr"][randInt(0, 2)];
  if (type === "num_num") {
    const a = randInt(10, 999), b = randInt(10, 999);
    return { type: "compare", leftExpr: String(a), rightExpr: String(b),
             leftValue: a, rightValue: b, answer: a < b ? "<" : a > b ? ">" : "=" };
  }
  if (type === "expr_num") {
    const base = makeArithmetic();
    const noise = [-2,-1,0,1,2][randInt(0,4)];
    const b = base.answer + noise;
    return { type: "compare", leftExpr: base.text.replace(" = ?",""), rightExpr: String(b),
             leftValue: base.answer, rightValue: b,
             answer: base.answer < b ? "<" : base.answer > b ? ">" : "=" };
  }
  // expr_expr: 2 phép tính, kết quả gần nhau
}
```

**UI:**
```
┌──────────────────────────────────┐
│     3 × 8    [<] [>] [=]   25   │
│              ↑ 3 nút lớn, nổi bật│
└──────────────────────────────────┘
```

Click 1 nút → chấm điểm ngay, highlight nút đúng/sai.

**Điểm:** +1 nếu đúng.

---

### 6.6 Sắp Xếp Dãy Số

**Mô tả:** Học sinh click chọn lần lượt các số theo thứ tự yêu cầu.

**Nội dung:** 5 số trong phạm vi 100–9999. Thứ tự tăng dần hoặc giảm dần.

**Schema câu hỏi:**
```javascript
{
  type: "sort",
  numbers: [347, 892, 156, 623, 415],
  order: "asc",                         // "asc" | "desc"
  answer: [156, 347, 415, 623, 892],
}
```

**Logic sinh câu hỏi:**
```javascript
function makeSort() {
  const order = Math.random() > 0.5 ? "asc" : "desc";
  const nums = Array.from({ length: 5 }, () => randInt(100, 999));
  // Đảm bảo không có số trùng
  if (new Set(nums).size < 5) return makeSort();
  const answer = [...nums].sort((a, b) => order === "asc" ? a - b : b - a);
  return { type: "sort", numbers: shuffle(nums), order, answer };
}
```

**UI — Click-to-place:**
```
Yêu cầu: Sắp xếp TĂNG DẦN

Thẻ chờ:   [ 347 ]  [ 892 ]  [ 415 ]   ← click để chọn
Hàng kết:  [  1  ]  [  2  ]  [  3  ]  [  4  ]  [  5  ]
```

Khi click thẻ số → di chuyển vào ô tiếp theo trong hàng kết quả. Click thẻ đã đặt → trả về hàng chờ.

**Logic chấm điểm:**
```javascript
const isCorrect = placedNumbers.every((n, i) => n === q.answer[i]);
```

Nút "Xác nhận" chỉ hiện khi đã đặt đủ 5 số.

**Điểm:** +1 nếu đúng hoàn toàn.

---

### 6.7 Tìm Quy Luật Dãy Số

**Mô tả:** Cho dãy số có quy luật, học sinh điền số tiếp theo vào ô input.

**Nội dung:** Quy luật cộng/trừ đều (bước 2–20), nhân/chia đều (bước 2–4).

**Schema câu hỏi:**
```javascript
{
  type: "pattern",
  sequence: [2, 5, 8, 11, null],  // null = ô cần điền
  rule: "+3",                      // hiển thị sau khi nộp
  answer: 14,
}
```

**Logic sinh câu hỏi:**
```javascript
function makePattern() {
  const rules = [
    { desc: "+3",  fn: (n, i) => n + 3  * i },
    { desc: "+5",  fn: (n, i) => n + 5  * i },
    { desc: "+7",  fn: (n, i) => n + 7  * i },
    { desc: "-2",  fn: (n, i) => n - 2  * i },
    { desc: "-4",  fn: (n, i) => n - 4  * i },
    { desc: "×2",  fn: (n, i) => n * Math.pow(2, i) },
    { desc: "×3",  fn: (n, i) => n * Math.pow(3, i) },
  ];
  const rule = rules[randInt(0, rules.length - 1)];
  const start = randInt(2, 20);
  const seq = Array.from({ length: 5 }, (_, i) => rule.fn(start, i));
  if (seq.some(n => n <= 0 || n > 9999)) return makePattern(); // retry
  return {
    type: "pattern",
    sequence: [...seq.slice(0, 4), null],
    rule: rule.desc,
    answer: seq[4],
  };
}
```

**UI:**
```
  [ 2 ]  [ 5 ]  [ 8 ]  [ 11 ]  [ ___ ]
                                ↑ input number, auto-focus
```

Sau khi nộp: hiển thị quy luật `Quy luật: +3` bên dưới.

**Điểm:** +1 nếu đúng.

---

### 6.8 Bảng Nhân — Speed Drill

**Mô tả:** 20 câu nhân nhanh có đếm giờ ngược, học sinh gõ kết quả liên tục không ngừng nghỉ.

**Nội dung:** Bảng nhân 2–9. Mỗi câu là 1 ô input number.

**Schema câu hỏi:**
```javascript
{
  type: "speedDrill",
  a: 7, b: 8,
  text: "7 × 8 = ?",
  answer: 56,
}
```

**Cấu hình session:**
```javascript
const SPEED_DRILL_CONFIG = {
  totalQuestions: 20,
  timeLimit: 120,          // 2 phút
  transitionDelay: 400,    // ms — nhanh hơn bài thường (400 thay vì 1500)
  bonusIfAllCorrect: 5,
};
```

**UI đặc biệt:**
```
┌──────────────────────────────────┐
│  ⏱ 01:42  ████████████░░░░░░    │  ← countdown bar
│                                  │
│       7  ×  8  =  [ ___ ]        │  ← to, rõ, auto-focus
│                                  │
│  Câu 3/20  ✅✅❌✅✅✅...         │  ← mini indicators
└──────────────────────────────────┘
```

- Nhấn Enter → chấm điểm → chuyển câu ngay (không có feedback overlay)
- Hết giờ → nộp luôn tất cả câu chưa trả lời là sai

**Điểm:** +1 mỗi câu đúng. Bonus +5 nếu đúng tất cả 20 câu trong thời gian.

---

### 6.9 Đổi Đơn Vị Đo Lường

**Mô tả:** Học sinh điền số thích hợp vào ô khi đổi đơn vị đo.

**Nội dung:**
- Độ dài: mm ↔ cm ↔ dm ↔ m ↔ km
- Khối lượng: g ↔ kg
- Thể tích: ml ↔ l

**Schema câu hỏi:**
```javascript
{
  type: "measurement",
  fromValue: 3,
  fromUnit: "m",
  toUnit: "cm",
  display: "3 m = □ cm",
  answer: 300,
}
```

**Bảng quy đổi:**
```javascript
const CONVERSIONS = {
  length: { mm: 1, cm: 10, dm: 100, m: 1000, km: 1_000_000 },
  weight: { g: 1, kg: 1000 },
  volume: { ml: 1, l: 1000 },
};
```

**UI:**
```
  3 m  =  [ ___ ]  cm
           ↑ input number
```

Có nút toggle "Xem bảng quy đổi" hiển thị bảng nhỏ làm gợi ý (không bắt buộc ẩn).

**Điểm:** +1 nếu đúng.

---

### 6.10 Bài Toán Tiền Tệ

**Mô tả:** Học sinh tính và tự gõ số tiền vào ô input (đơn vị: đồng).

**Nội dung:** Tổng tiền mua hàng, tiền thối lại, so sánh đủ/thiếu tiền.

**Schema câu hỏi:**
```javascript
{
  type: "money",
  subtype: "change",
  story: "Nam mua 1 gói kẹo 3.500đ và 1 bút chì 2.000đ. Nam đưa 10.000đ.",
  question: "Nam được thối lại bao nhiêu tiền?",
  illustration: [
    { label: "Kẹo", price: 3500 },
    { label: "Bút chì", price: 2000 },
  ],
  paid: 10000,
  totalCost: 5500,
  answer: 4500,
  unit: "đồng",
}
```

**UI:**
```
┌──────────────────────────────────────┐
│ [minh hoạ tờ tiền SVG]               │
│ Nam mua 1 gói kẹo 3.500đ và 1 bút    │
│ chì 2.000đ. Nam đưa 10.000đ.         │
│                                      │
│ Nam được thối lại bao nhiêu tiền?    │
│                                      │
│  [ _______ ]  đồng                   │  ← input number
│  [     Xác nhận     ]                │
└──────────────────────────────────────┘
```

**Điểm:** +1 nếu đúng.

---

### 6.11 Đọc Lịch và Tính Ngày

**Mô tả:** Học sinh nhìn tờ lịch tháng và click chọn ngày đúng hoặc gõ số ngày.

**Nội dung:**
- "Ngày 15 tháng 3 là thứ mấy?" → Click ô ngày trên lịch
- "Tháng này có bao nhiêu ngày?" → Input number
- "10 ngày sau ngày 20 là ngày mấy?" → Input number

**Schema câu hỏi:**
```javascript
{
  type: "calendar",
  month: 3, year: 2025,
  subtype: "day_of_week",          // "day_of_week" | "count_days" | "add_days"
  targetDay: 15,
  question: "Ngày 15 tháng 3 năm 2025 là thứ mấy?",
  answer: 7,                       // 1=Thứ Hai ... 7=Chủ Nhật
  answerLabel: "Chủ Nhật",
}
```

**UI — subtype `day_of_week`:**

Render lịch tháng đầy đủ, highlight ngày được hỏi. Bên dưới lịch: 7 nút thứ (`T2 T3 T4 T5 T6 T7 CN`). Học sinh click nút thứ.

**UI — subtype `count_days` / `add_days`:**
```
  Tháng 3 có bao nhiêu ngày?  [ ___ ]
```

**Điểm:** +1 nếu đúng.

---

### 6.12 Tính Khoảng Thời Gian

**Mô tả:** Học sinh tính và gõ số giờ + số phút của khoảng thời gian.

**Nội dung:**
- `elapsed`: cho giờ bắt đầu và kết thúc → tính khoảng cách
- `endTime`: cho giờ bắt đầu và thời lượng → tính giờ kết thúc

**Schema câu hỏi:**
```javascript
{
  type: "duration",
  subtype: "elapsed",
  startTime: "8:30",
  endTime: "10:15",
  question: "Từ 8 giờ 30 phút đến 10 giờ 15 phút là bao lâu?",
  answerHours: 1,
  answerMinutes: 45,
  answerTotalMinutes: 105,
}
```

**UI — subtype `elapsed`:**
```
┌──────────────────────────────────────┐
│  [Đồng hồ 8:30]    [Đồng hồ 10:15]  │
│                                      │
│  Khoảng thời gian là:                │
│  [ ___ ] giờ  [ ___ ] phút           │
│  [        Xác nhận        ]          │
└──────────────────────────────────────┘
```

**Logic chấm điểm:**
```javascript
const inputTotal = Number(inputHours) * 60 + Number(inputMinutes);
const isCorrect  = inputTotal === q.answerTotalMinutes;
```

**Điểm:** +1 nếu đúng.

---

### 6.13 Chu Vi Hình Học

**Mô tả:** Học sinh nhìn hình học có ghi kích thước và tự tính chu vi.

**Nội dung:** Hình chữ nhật `(dài + rộng) × 2`, Hình vuông `cạnh × 4`. Có dạng tìm cạnh khi biết chu vi.

**Schema câu hỏi:**
```javascript
{
  type: "perimeter",
  shape: "rectangle",
  dimensions: { width: 8, height: 5 },
  unit: "cm",
  question: "Tính chu vi hình chữ nhật.",
  formulaHint: "CV = (dài + rộng) × 2",
  answer: 26,
  answerUnit: "cm",
}
```

**UI:**
```
  [SVG hình chữ nhật ghi 8cm và 5cm lên các cạnh]

  Chu vi =  [ ___ ]  cm
             ↑ input
```

Hiển thị công thức gợi ý có thể toggle.

**Điểm:** +1 nếu đúng.

---

### 6.14 Nhận Biết Hình

**Mô tả:** Học sinh đếm số lượng hình trong hình ghép phức tạp và gõ số vào ô input.

**Nội dung:** Đếm tam giác, tứ giác, hình vuông trong hình tổng hợp.

**Schema câu hỏi:**
```javascript
{
  type: "shapes",
  svgKey: "triangles_grid_03",
  question: "Có bao nhiêu hình tam giác trong hình dưới đây?",
  answer: 7,
}
```

**Cách quản lý nội dung:**
```javascript
// Tạo thủ công, không sinh ngẫu nhiên
const SHAPE_PUZZLES = {
  "triangles_grid_01": { svg: `...`, answer: 4, label: "tam giác" },
  "triangles_grid_02": { svg: `...`, answer: 6, label: "tam giác" },
  "squares_grid_01":   { svg: `...`, answer: 5, label: "hình vuông" },
  // tối thiểu 15 puzzle
};
```

**UI:**
```
  [SVG hình ghép]

  Có bao nhiêu hình tam giác?
  [ ___ ]  hình
```

**Điểm:** +1 nếu đúng.

---

### 6.15 Kéo Thả Ghép Phép Tính

**Mô tả:** Học sinh kéo thẻ số và toán tử vào 3 ô trống để tạo phép tính đúng với kết quả cho sẵn.

**Nội dung:** Cho kết quả, học sinh lắp `a`, `op`, `b` vào đúng vị trí.

**Schema câu hỏi:**
```javascript
{
  type: "dragDrop",
  target: 24,
  tiles: [3, 8, 4, 6, "×", "+", "-", "÷"],
  solutions: [
    { a: 3,  op: "×", b: 8 },
    { a: 8,  op: "×", b: 3 },
    { a: 4,  op: "×", b: 6 },
    { a: 6,  op: "×", b: 4 },
  ],
}
```

**UI:**
```
Kéo thẻ để tạo phép tính = 24

Thẻ:  [ 3 ] [ 8 ] [ 4 ] [ 6 ] [ × ] [ + ] [ - ] [ ÷ ]
               ↓ kéo xuống
Phép: [ ___ ]  [ ___ ]  [ ___ ]  =  24
```

**Logic chấm điểm:**
```javascript
function checkDragDrop(placed, solutions) {
  const { a, op, b } = placed;
  return solutions.some(s => s.a === a && s.op === op && s.b === b);
}
```

Nút "Xác nhận" chỉ active khi đủ 3 ô đã có thẻ.

**Điểm:** +1 nếu đúng.

---

### 6.16 Vẽ Kim Đồng Hồ

**Mô tả:** Cho sẵn giờ bằng chữ, học sinh kéo kim đồng hồ SVG đến đúng vị trí.

**Schema câu hỏi:**
```javascript
{
  type: "drawClock",
  targetHours: 8,
  targetMinutes: 30,
  question: "Hãy vẽ kim đồng hồ chỉ 8 giờ 30 phút",
}
```

**Component `<DrawableClock>`:**
```javascript
// Kim phút: snap to nearest 5 phút khi thả
function snapAngleToMinutes(angleDeg) {
  const minutes = Math.round(angleDeg / 6) % 60;           // 360° / 60 phút = 6°/phút
  return Math.round(minutes / 5) * 5;                       // snap về bước 5
}

// Kim giờ: tự động tính từ giờ + phút đã snap
function hourAngle(h, m) {
  return (h % 12) * 30 + m * 0.5;                           // 30°/giờ + 0.5°/phút
}

// Đánh giá
function evaluate(drawnHours, drawnMinutes, target) {
  return drawnMinutes === target.targetMinutes
      && (drawnHours % 12) === (target.targetHours % 12);
}
```

**UI:**
```
  "Hãy vẽ kim đồng hồ chỉ 8 giờ 30 phút"

  [SVG đồng hồ 220×220, kim kéo được]
  ← kéo đầu kim phút → kim giờ tự cập nhật

  [     Xác nhận     ]
```

**Điểm:** +1 nếu cả kim giờ lẫn kim phút đều đúng.

---

### 6.17 Ước Lượng và Làm Tròn

**Mô tả:** Học sinh làm tròn số và gõ kết quả vào ô input.

**Nội dung:** Làm tròn đến hàng chục (số 2 chữ số), hàng trăm (3 chữ số), hàng nghìn (4 chữ số).

**Schema câu hỏi:**
```javascript
{
  type: "rounding",
  number: 347,
  roundTo: "hundred",       // "ten" | "hundred" | "thousand"
  roundToLabel: "hàng trăm",
  question: "Làm tròn 347 đến hàng trăm gần nhất.",
  answer: 300,
  lineMin: 300, lineMax: 400,   // để vẽ number line minh hoạ
}
```

**Logic sinh câu hỏi:**
```javascript
function makeRounding() {
  const config = [
    { roundTo: "ten",      roundToLabel: "hàng chục",  range: [11, 99],    step: 10 },
    { roundTo: "hundred",  roundToLabel: "hàng trăm",  range: [101, 999],  step: 100 },
    { roundTo: "thousand", roundToLabel: "hàng nghìn", range: [1001, 9999],step: 1000 },
  ][randInt(0, 2)];

  const number = randInt(...config.range);
  const answer = Math.round(number / config.step) * config.step;
  const lineMin = Math.floor(number / config.step) * config.step;
  const lineMax = lineMin + config.step;

  return { type: "rounding", number, answer, lineMin, lineMax, ...config };
}
```

**UI:**
```
  [SVG number line: 300 ──●── 400, dấu chấm tại 347]

  Làm tròn 347 đến hàng trăm gần nhất:

  [ ___ ]
```

**Điểm:** +1 nếu đúng.

---

## 7. Hệ Thống Gamification

### Điểm và Streak

```javascript
const STREAK_MESSAGES = {
  3:  { emoji: "🔥", text: "3 liên tiếp!" },
  5:  { emoji: "⚡", text: "Xuất sắc! 5 liên tiếp!" },
  10: { emoji: "🌟", text: "Huyền thoại! 10 liên tiếp!" },
};
```

### Huy Hiệu

| Huy hiệu | Điều kiện | Icon |
|----------|-----------|------|
| Ngôi sao vàng | Đúng 100% 1 bài | ⭐ |
| Siêu tốc | Speed drill ≤ 90s | ⚡ |
| Nhà thám hiểm | Làm đủ 5 loại bài | 🗺️ |
| Chuyên gia đồng hồ | Đúng 10 câu đọc đồng hồ liên tiếp | 🕐 |
| Thiên tài toán | Streak 10 trong 1 session | 🧠 |
| Học sinh chăm chỉ | Làm bài 7 ngày liên tiếp | 📅 |

### Lưu Tiến Độ

LocalStorage dùng cho các cài đặt nhỏ (âm thanh, tên người dùng). Với lịch sử bài tập, **bắt buộc dùng IndexedDB** để tránh tràn bộ nhớ và hỗ trợ truy vấn theo ngày.

```javascript
// LocalSettings mapping
const SETTINGS_KEY = "toan3_v2_settings";

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
```

---

## 8. UX cho Trẻ Em 8–9 Tuổi

### Quy tắc thiết kế bắt buộc

| Quy tắc | Lý do |
|---------|-------|
| Font ≥ 18px cho nội dung bài | Trẻ đọc chậm hơn người lớn |
| Câu hỏi tối đa 2 dòng | Tránh quá tải nhận thức |
| Nút / ô input ≥ 44×44px | Dễ chạm trên màn hình cảm ứng |
| Auto-focus ô đầu tiên mỗi câu | Không mất thêm bước tap |
| Phản hồi visible trong < 200ms | Trẻ mất kiên nhẫn nhanh |
| Không dùng "Sai" / "Wrong" trần trụi | Dùng "Thử lại!" / "Cố lên nào!" |
| Không trừ điểm | Tránh cảm giác bị phạt |
| Hiển thị đáp án đúng khi sai | Học từ lỗi sai ngay lập tức |
| Ô input số: tắt spinner | Spinner gây nhầm lẫn cho trẻ |

### Cấu trúc phiên học lý tưởng

```
Một phiên = 15–20 phút
├── Warm-up:    3–5 câu dễ
├── Main:       7–10 câu trung bình
└── Challenge:  2–3 câu khó (tự chọn)

Sau mỗi 5 câu: mini celebration (confetti nhỏ)
```

### Feedback system

```javascript
const CORRECT_MSGS = ["⭐ Đúng rồi!", "🎉 Giỏi lắm!", "💪 Tuyệt vời!", "🌟 Xuất sắc!"];
const WRONG_MSGS   = ["💡 Thử lại nhé!", "🤔 Cố lên nào!", "👍 Gần đúng rồi!"];

function getFeedback(isCorrect) {
  const pool = isCorrect ? CORRECT_MSGS : WRONG_MSGS;
  return pool[Math.floor(Math.random() * pool.length)];
}
```

---

## 9. Quy Ước Code

### Đặt tên

```javascript
makeArithmetic()     // ✅ Generator: make + PascalCase
ArithmeticQ          // ✅ Component: PascalCase + Q suffix
startQuiz()          // ✅ Action: verb + noun
submitAnswer()       // ✅
.quiz-wrap           // ✅ CSS: kebab-case
```

### Template generator (v2.0 — không có choices)

```javascript
export function makeNewType() {
  const a = randInt(1, 10);
  const answer = computeAnswer(a);

  if (answer <= 0) return makeNewType();  // retry — không throw

  return {
    type: "newType",    // bắt buộc — khớp tên file
    // ...fields UI riêng...
    answer,             // bắt buộc — KHÔNG thêm "choices"
  };
}
```

### Template question component (v2.0 — input tự do)

```jsx
export function NewTypeQ({ q, onSubmit }) {
  const [value, setValue]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (submitted || value === "") return;
    setSubmitted(true);
    onSubmit(Number(value) === q.answer);
  };

  return (
    <div>
      {/* Render câu hỏi */}
      <NumberInput
        value={value}
        onChange={setValue}
        disabled={submitted}
        autoFocus
      />
      {submitted && (
        <div style={{ color: Number(value) === q.answer ? "green" : "red" }}>
          {Number(value) === q.answer ? "✅ Đúng!" : `❌ Đáp án: ${q.answer}`}
        </div>
      )}
      <SubmitBar fields={[value]} onSubmit={handleSubmit} submitted={submitted} />
    </div>
  );
}
```

---

[ ] Không có lỗi khi học sinh gõ số âm hoặc số thập phân

---

## 10. Hệ Thống Lưu Trữ Kết Quả (IndexedDB)

### Tại sao dùng IndexedDB?
- **Dung lượng lớn:** Lưu được hàng chục nghìn phiên học (localStorage giới hạn 5MB).
- **Truy vấn mạnh mẽ:** Dễ dàng lọc kết quả theo ngày, theo loại bài.
- **Cấu trúc:** Lưu trữ object phức tạp (chi tiết từng câu trả lời) không cần stringify.

### Cấu hình Database (Dexie.js)
```javascript
// src/db/gameDB.js
import Dexie from 'dexie';

export const db = new Dexie('Toan3HocTap');

db.version(1).stores({
  sessions: '++id, date, type, score, totalCorrect', // index 'date' để tìm kiếm nhanh
});

// Hàm lưu kết quả sau mỗi bài tập
export async function saveQuizToDB(data) {
  try {
    await db.sessions.add({
      ...data,
      date: new Date().toISOString().split('T')[0], // Định dạng YYYY-MM-DD
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Lỗi lưu DB:", error);
  }
}
```

---

## 11. Giao Diện Xem Lại Lịch Sử

### Chức năng chính
1. **Lọc theo ngày:** Chọn ngày trên calendar hoặc danh sách thả xuống.
2. **Thống kê nhanh:** Tổng số câu làm được trong ngày, tỷ lệ đúng.
3. **Review chi tiết:** Click vào một phiên tập để xem lại danh sách câu hỏi và đáp án đã chọn.

### Template component `HistoryOverview.jsx`
```jsx
export function HistoryOverview() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Truy vấn kết quả theo ngày đã chọn
    const loadData = async () => {
      const data = await db.sessions
        .where('date')
        .equals(selectedDate)
        .reverse()
        .toArray();
      setItems(data);
    };
    loadData();
  }, [selectedDate]);

  return (
    <div className="history-wrap">
      <h2>Lịch sử học tập 📅</h2>
      <input 
        type="date" 
        value={selectedDate} 
        onChange={e => setSelectedDate(e.target.value)}
        className="date-picker"
      />

      <div className="session-list">
        {items.length === 0 ? (
          <p>Hôm nay bạn chưa làm bài nào. Cố gắng lên nhé! 💪</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="session-card">
              <div className="info">
                <strong>{getTypeLabel(item.type)}</strong>
                <span>{item.score}/{item.total} câu đúng</span>
              </div>
              <div className="time">
                {new Date(item.timestamp).toLocaleTimeString('vi-VN')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

### CSS Gợi ý cho Lịch sử
```css
.session-card {
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border: 2px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-card:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.date-picker {
  padding: 8px;
  border-radius: 8px;
  border: 2px solid #3b82f6;
  font-family: inherit;
  margin-bottom: 16px;
}
```

---

## 12. KPI và Đánh Giá Chất Lượng

### KPI kỹ thuật

| Chỉ số | Mục tiêu |
|--------|---------|
| Thời gian tải trang đầu | < 2 giây (3G) |
| Time to Interactive | < 3 giây |
| Lighthouse Performance | ≥ 90 |
| Không có lỗi console | 0 error trong production |

### KPI học tập

| Chỉ số | Mục tiêu tháng 3 |
|--------|----------------|
| Thời gian học trung bình / ngày | ≥ 15 phút |
| Tỷ lệ hoàn thành bài | ≥ 80% |
| D7 retention | ≥ 40% |
| Độ chính xác sau 4 tuần | Tăng ≥ 15% |

### Checklist trước khi ra mắt mỗi loại bài tập mới

```
Input & UX
[ ] Auto-focus vào ô đầu tiên khi câu mới xuất hiện
[ ] Nút xác nhận disabled khi chưa điền đủ
[ ] Nhấn Enter = xác nhận (trên desktop)
[ ] Ô input type=number đã tắt spinner
[ ] Ô input đủ rộng để hiển thị số lớn nhất có thể
[ ] Không cho sửa sau khi đã nộp
[ ] Hiển thị đáp án đúng khi sai (màu đỏ, rõ ràng)
[ ] Chuyển câu tiếp sau 1.5s (không quá nhanh, không quá chậm)

Generator
[ ] Không sinh câu hỏi có số âm
[ ] Không sinh câu hỏi có kết quả > phạm vi lớp 3
[ ] Không có field "choices" trong object trả về
[ ] Test với 200 câu sinh ngẫu nhiên — không có crash, không có NaN

Tương thích
[ ] UI hoạt động trên màn hình 375px (iPhone SE)
[ ] Không có lỗi console.error trong production
[ ] Không có lỗi khi học sinh gõ chữ vào ô số
[ ] Không có lỗi khi học sinh gõ số âm hoặc số thập phân
```

---

*Tài liệu này sẽ được cập nhật sau mỗi giai đoạn phát triển.*  
*Phiên bản tiếp theo (3.0): thêm hướng dẫn tích hợp AI sinh bài tập động.*
