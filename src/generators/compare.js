import { randInt, MAX_NUMBER } from './utils';

export function makeCompare() {
  const mode = randInt(0, 1);
  let left, right, leftVal, rightVal;

  if (mode === 0) { // Số với số
    leftVal = randInt(100, MAX_NUMBER);
    rightVal = randInt(100, MAX_NUMBER);
    left = leftVal;
    right = rightVal;
  } else { // Phép tính với số
    const a = randInt(10, Math.floor(MAX_NUMBER / 2));
    const b = randInt(10, Math.floor(MAX_NUMBER / 2));
    leftVal = a + b;
    left = `${a} + ${b}`;
    rightVal = randInt(Math.max(0, leftVal - 100), Math.min(MAX_NUMBER, leftVal + 100));
    right = rightVal;
  }

  const answer = leftVal > rightVal ? ">" : (leftVal < rightVal ? "<" : "=");

  return {
    type: "compare",
    text: "Điền dấu thích hợp (<, >, =)",
    left,
    right,
    answer,
  };
}
