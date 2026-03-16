import { randInt } from './utils';

export function makeClock() {
  const h = randInt(1, 12);
  const m = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][randInt(0, 11)];
  
  return {
    type: "clock",
    h, m,
    text: "Mấy giờ rồi nhỉ?",
    answer: { h, m }, // Cần nhập 2 ô
  };
}
