import { randInt } from './utils';

export function makeClock() {
  const h = randInt(1, 12);
  const m = randInt(0, 59);
  
  return {
    type: "clock",
    h, m,
    text: "Mấy giờ rồi nhỉ?",
    answer: { h, m }, // Cần nhập 2 ô
  };
}
