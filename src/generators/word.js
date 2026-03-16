import { randInt } from './utils';

export function makeWordProblem() {
  const scenario = randInt(0, 1);
  const names = ["Lan", "Mai", "Nam", "An", "Bình", "Hoa", "Minh"];
  const units = ["viên bi", "quyển sách", "con tem", "miếng thạch", "bông hoa"];
  
  const p1 = names[randInt(0, 3)];
  const p2 = names[randInt(4, 6)];
  const unit = units[randInt(0, 4)];
  
  if (scenario === 0) { // Nhiều hơn + Tính tổng
    const val1 = randInt(10, 30);
    const diff = randInt(5, 15);
    const val2 = val1 + diff;
    const total = val1 + val2;
    return {
      type: "word",
      text: `${p1} có ${val1} ${unit}. ${p2} có nhiều hơn ${p1} ${diff} ${unit}. Hỏi cả hai bạn có tất cả bao nhiêu ${unit}?`,
      answer: total,
      steps: [
        { label: `Số ${unit} của ${p2} là:`, a: val1, op: '+', b: diff, result: val2 },
        { label: `Cả hai bạn có số ${unit} là:`, a: val1, op: '+', b: val2, result: total }
      ]
    };
  } else { // Ít hơn + Tính tổng
    const val1 = randInt(20, 50);
    const diff = randInt(5, 15);
    const val2 = val1 - diff;
    const total = val1 + val2;
    return {
      type: "word",
      text: `${p1} có ${val1} ${unit}. ${p2} có ít hơn ${p1} ${diff} ${unit}. Hỏi cả hai bạn có tất cả bao nhiêu ${unit}?`,
      answer: total,
      steps: [
        { label: `Số ${unit} của ${p2} là:`, a: val1, op: '-', b: diff, result: val2 },
        { label: `Cả hai bạn có số ${unit} là:`, a: val1, op: '+', b: val2, result: total }
      ]
    };
  }
}
