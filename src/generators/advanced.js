import { rand, pick, shuffle, MAX_NUMBER } from './utils';

// 1. Measurement (Đo lường)
export function makeMeasurement() {
  const units = [
    { from: 'm', to: 'cm', ratio: 100 },
    { from: 'dm', to: 'cm', ratio: 10 },
    { from: 'm', to: 'dm', ratio: 10 },
    { from: 'km', to: 'm', ratio: 1000 },
    { from: 'kg', to: 'g', ratio: 1000 },
    { from: 'l', to: 'ml', ratio: 1000 },
  ];
  
  const unit = pick(units);
  const val = rand(1, 10);
  
  return {
    text: `Đổi đơn vị: ${val} ${unit.from} = ... ${unit.to}`,
    answer: val * unit.ratio,
    hint: `1 ${unit.from} = ${unit.ratio} ${unit.to}`
  };
}

// 2. Money (Tiền tệ)
export function makeMoney() {
  const items = [
    { name: 'quyển vở', price: 5000, unit: 'quyển' },
    { name: 'cái bút', price: 3000, unit: 'cái' },
    { name: 'thước kẻ', price: 2000, unit: 'cái' },
    { name: 'cục tẩy', price: 1000, unit: 'cái' },
  ];
  
  const item1 = pick(items);
  const others = items.filter(i => i.name !== item1.name);
  const item2 = pick(others);
  
  const q1 = rand(2, 5);
  const q2 = rand(2, 4);
  
  const cost1 = item1.price * q1;
  const cost2 = item2.price * q2;
  const total = cost1 + cost2;
  
  return {
    type: "word",
    text: `Bé mua ${q1} ${item1.name} (giá ${item1.price}đ/${item1.unit}) và ${q2} ${item2.name} (giá ${item2.price}đ/${item2.unit}). Bé phải trả bao nhiêu tiền?`,
    answer: total,
    steps: [
      { label: `Tiền mua ${item1.name} là:`, a: item1.price, op: '×', b: q1, result: cost1 },
      { label: `Tiền mua ${item2.name} là:`, a: item2.price, op: '×', b: q2, result: cost2 },
      { label: "Bé phải trả số tiền là:", a: cost1, op: '+', b: cost2, result: total }
    ]
  };
}

// 3. Sorting (Sắp xếp)
export function makeSorting() {
  const count = 4;
  const numbers = [];
  while(numbers.length < count) {
    const n = rand(10, MAX_NUMBER);
    if (!numbers.includes(n)) numbers.push(n);
  }
  
  const isAsc = Math.random() > 0.5;
  const sorted = [...numbers].sort((a,b) => isAsc ? a - b : b - a);
  
  return {
    text: `Sắp xếp các số sau theo thứ tự ${isAsc ? 'từ bé đến lớn' : 'từ lớn đến bé'}:`,
    options: numbers,
    answer: sorted,
    isAsc
  };
}

// 4. Patterns (Quy luật)
export function makePattern() {
  const start = rand(1, 20);
  const step = rand(2, 5);
  const type = pick(['add', 'sub']);
  
  const sequence = [];
  let current = start;
  for(let i=0; i<4; i++) {
    sequence.push(current);
    current = type === 'add' ? current + step : current - step;
    if (current < 0) current = 0;
  }
  
  const answer = current;
  
  return {
    text: "Tìm số tiếp theo trong quy luật sau:",
    sequence: sequence,
    answer: answer,
    hint: "Hãy xem các số cách nhau bao nhiêu đơn vị nhé!"
  };
}

// 5. Perimeter (Chu vi)
export function makePerimeter() {
  const mode = rand(0, 2); // 0: Square, 1: Rectangle, 2: 2-step Word Problem
  
  if (mode === 0) {
    const a = rand(2, 10);
    return {
      text: `Tính chu vi hình vuông có cạnh dài ${a}cm:`,
      answer: a * 4,
      hint: "Chu vi hình vuông = Cạnh × 4"
    };
  } else if (mode === 1) {
    const a = rand(5, 10);
    const b = rand(2, 4);
    return {
      text: `Tính chu vi hình chữ nhật có chiều dài ${a}cm và chiều rộng ${b}cm:`,
      answer: (a + b) * 2,
      hint: "Chu vi hình chữ nhật = (Dài + Rộng) × 2"
    };
  } else {
    // Multi-step Word Problem (2 steps)
    const w = rand(5, 20);
    const diff = rand(2, 10);
    const l = w + diff;
    const p = (l + w) * 2;
    
    return {
      type: "word",
      text: `Một hình chữ nhật có chiều rộng là ${w}cm. Chiều dài hơn chiều rộng ${diff}cm. Tính chu vi hình chữ nhật đó.`,
      answer: p,
      steps: [
        { label: "Chiều dài hình chữ nhật là:", a: w, op: '+', b: diff, result: l },
        { 
          label: "Chu vi hình chữ nhật là:", 
          type: 'perimeter_formula', 
          l: l, 
          w: w, 
          result: p 
        }
      ]
    };
  }
}
// 6. Area (Diện tích)
export function makeArea() {
  const mode = rand(0, 2); // 0: Square, 1: Rectangle, 2: 2-step Word Problem
  
  if (mode === 0) {
    const a = rand(2, 10);
    return {
      text: `Tính diện tích hình vuông có cạnh dài ${a}cm:`,
      answer: a * a,
      hint: "Diện tích hình vuông = Cạnh × Cạnh"
    };
  } else if (mode === 1) {
    const a = rand(5, 12);
    const b = rand(2, 4);
    return {
      text: `Tính diện tích hình chữ nhật có chiều dài ${a}cm và chiều rộng ${b}cm:`,
      answer: a * b,
      hint: "Diện tích hình chữ nhật = Dài × Rộng"
    };
  } else {
    // Multi-step Word Problem (2 steps)
    const scenario = rand(0, 3);
    
    if (scenario === 0) {
      const w = rand(4, 10);
      const multiplier = rand(2, 3);
      const l = w * multiplier;
      const area = l * w;
      
      return {
        type: "word",
        text: `Một hình chữ nhật có chiều rộng là ${w}cm. Chiều dài gấp ${multiplier} lần chiều rộng. Tính diện tích hình chữ nhật đó.`,
        answer: area,
        steps: [
          { label: "Chiều dài hình chữ nhật là:", a: w, op: '×', b: multiplier, result: l },
          { label: "Diện tích hình chữ nhật là:", a: l, op: '×', b: w, result: area }
        ]
      };
    } else if (scenario === 1) {
      const divisor = pick([2, 3]);
      const w = rand(4, 10);
      const l = w * divisor;
      const area = l * w;

      return {
        type: "word",
        text: `Một hình chữ nhật có chiều dài là ${l}cm. Chiều rộng bằng 1/${divisor} chiều dài. Tính diện tích hình chữ nhật đó.`,
        answer: area,
        steps: [
          { label: "Chiều rộng hình chữ nhật là:", a: l, op: '÷', b: divisor, result: w },
          { label: "Diện tích hình chữ nhật là:", a: l, op: '×', b: w, result: area }
        ]
      };
    } else if (scenario === 2) {
      const w = rand(5, 15);
      const diff = rand(2, 10);
      const l = w + diff;
      const area = l * w;
      
      return {
        type: "word",
        text: `Một hình chữ nhật có chiều rộng là ${w}cm. Chiều dài hơn chiều rộng ${diff}cm. Tính diện tích hình chữ nhật đó.`,
        answer: area,
        steps: [
          { label: "Chiều dài hình chữ nhật là:", a: w, op: '+', b: diff, result: l },
          { label: "Diện tích hình chữ nhật là:", a: l, op: '×', b: w, result: area }
        ]
      };
    } else {
      const l = rand(10, 25);
      const diff = rand(2, 5);
      const w = l - diff;
      const area = l * w;
      
      return {
        type: "word",
        text: `Một hình chữ nhật có chiều dài là ${l}cm. Chiều rộng kém chiều dài ${diff}cm. Tính diện tích hình chữ nhật đó.`,
        answer: area,
        steps: [
          { label: "Chiều rộng hình chữ nhật là:", a: l, op: '-', b: diff, result: w },
          { label: "Diện tích hình chữ nhật là:", a: l, op: '×', b: w, result: area }
        ]
      };
    }
  }
}

// 7. Rounding (Làm tròn)
export function makeRounding() {
  const type = pick(['chục', 'trăm', 'nghìn']);
  let val, answer;
  
  if (type === 'chục') {
    val = rand(11, 990); // Expanded range
    const lastDigit = val % 10;
    answer = lastDigit >= 5 ? (Math.floor(val / 10) + 1) * 10 : Math.floor(val / 10) * 10;
  } else if (type === 'trăm') {
    val = rand(101, 9900); // Expanded range
    const lastTwo = val % 100;
    answer = lastTwo >= 50 ? (Math.floor(val / 100) + 1) * 100 : Math.floor(val / 100) * 100;
  } else { // nghìn
    val = rand(1001, MAX_NUMBER);
    const lastThree = val % 1000;
    answer = lastThree >= 500 ? (Math.floor(val / 1000) + 1) * 1000 : Math.floor(val / 1000) * 1000;
  }
  
  return {
    text: `Làm tròn số ${val} đến hàng ${type} gần nhất:`,
    answer: answer,
    hint: type === 'chục' ? "Nếu hàng đơn vị từ 5 trở lên thì cộng thêm 1 chục nhé!" : "Nếu 2 chữ số cuối từ 50 trở lên thì cộng thêm 1 trăm nhé!"
  };
}

// 7. Calendar (Ngày tháng)
export function makeCalendar() {
  const months = [
    { name: 'Tháng 1', days: 31 },
    { name: 'Tháng 2', days: 28 }, // Đơn giản hóa không tính năm nhuận
    { name: 'Tháng 3', days: 31 },
    { name: 'Tháng 4', days: 30 },
    { name: 'Tháng 5', days: 31 },
    { name: 'Tháng 6', days: 30 },
    { name: 'Tháng 7', days: 31 },
    { name: 'Tháng 8', days: 31 },
    { name: 'Tháng 9', days: 30 },
    { name: 'Tháng 10', days: 31 },
    { name: 'Tháng 11', days: 30 },
    { name: 'Tháng 12', days: 31 },
  ];
  
  const m = pick(months);
  return {
    text: `${m.name} có bao nhiêu ngày?`,
    answer: m.days,
    hint: "Hãy nhớ bài thơ 'Tháng tư, sáu, chín, mười một có ba mươi ngày' nhé!"
  };
}

// 8. Duration (Khoảng thời gian)
export function makeDuration() {
  const isComplex = Math.random() > 0.5;
  
  if (isComplex) {
    const startH = rand(1, 10);
    const startM = pick([0, 15, 30, 45]);
    const durationH = rand(0, 3);
    const durationM = pick([15, 30, 45]);
    
    let totalMinutes = durationH * 60 + durationM;
    let endTotalMinutes = (startH * 60 + startM) + totalMinutes;
    
    const endH = Math.floor(endTotalMinutes / 60);
    const endM = endTotalMinutes % 60;

    const finalH = Math.floor(totalMinutes / 60);
    const finalM = totalMinutes % 60;

    return {
      type: "duration_complex",
      text: `Bé bắt đầu học lúc ${startH} giờ ${startM > 0 ? startM + ' phút' : 'đúng'} và kết thúc lúc ${endH} giờ ${endM > 0 ? endM + ' phút' : 'đúng'}. Bé đã học trong bao lâu?`,
      answer: { h: finalH, m: finalM },
      hint: "Hãy tính số tiếng và số phút bé đã học nhé!"
    };
  } else {
    const startH = rand(1, 10);
    const duration = rand(1, 5);
    const endH = startH + duration;
    
    return {
      text: `Bé bắt đầu học lúc ${startH} giờ và kết thúc lúc ${endH} giờ. Bé đã học trong bao nhiêu tiếng?`,
      answer: duration,
      hint: "Lấy giờ kết thúc trừ đi giờ bắt đầu nhé!"
    };
  }
}

// 9. Shapes (Nhận biết hình)
export function makeShapes() {
  const shapes = [
    { name: 'hình tam giác', count: rand(2, 5) },
    { name: 'hình tứ giác', count: rand(2, 4) },
    { name: 'hình tròn', count: rand(1, 4) },
  ];
  const target = pick(shapes);
  
  return {
    text: `Quan sát hình vẽ và cho biết có bao nhiêu ${target.name}?`,
    answer: target.count,
    shapeType: target.name,
    allShapes: shapes,
    hint: "Hãy đếm thật kỹ và đừng bỏ sót hình nào nhé!"
  };
}

// 10. Draw Clock (Vẽ kim đồng hồ) - Answer is the target time
export function makeDrawClock() {
  const h = rand(1, 12);
  const m = rand(0, 59);
  
  return {
    text: `Hãy xoay kim đồng hồ để chỉ ${h} giờ ${m === 0 ? 'đúng' : m + ' phút'}:`,
    answer: { h, m },
    hint: "Kim ngắn chỉ giờ, kim dài chỉ phút!"
  };
}

