import { randInt, MAX_NUMBER } from './utils';

export function makeArithmetic() {
  const ops = ["+", "-", "×", "÷"];
  const op = ops[randInt(0, 3)];
  let a, b, answer;

  if (op === "+") {
    a = randInt(1, Math.floor(MAX_NUMBER * 0.9));
    b = randInt(1, MAX_NUMBER - a);
    answer = a + b;
  } else if (op === "-") {
    a = randInt(10, MAX_NUMBER);
    b = randInt(1, a - 1);
    answer = a - b;
  } else if (op === "×") {
    a = randInt(2, 9);
    b = randInt(2, Math.floor(MAX_NUMBER / a));
    answer = a * b;
  } else if (op === "÷") {
    b = randInt(2, 9);
    answer = randInt(2, Math.floor(MAX_NUMBER / b));
    a = b * answer;
  }

  return {
    type: "arithmetic",
    a, op, b,
    text: `${a} ${op} ${b} = ?`,
    answer,
  };
}
