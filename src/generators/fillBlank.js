import { randInt, MAX_NUMBER } from './utils';

export function makeFillBlank() {
  const mode = randInt(0, 3);
  let a, b, c, questionText, answer;

  if (mode === 0) { // a + ? = c
    a = randInt(1, Math.floor(MAX_NUMBER * 0.8));
    answer = randInt(1, MAX_NUMBER - a);
    c = a + answer;
    questionText = `${a} + ? = ${c}`;
  } else if (mode === 1) { // ? + b = c
    answer = randInt(1, Math.floor(MAX_NUMBER * 0.8));
    b = randInt(1, MAX_NUMBER - answer);
    c = answer + b;
    questionText = `? + ${b} = ${c}`;
  } else if (mode === 2) { // a - ? = c
    a = randInt(10, MAX_NUMBER);
    answer = randInt(1, a - 1);
    c = a - answer;
    questionText = `${a} - ? = ${c}`;
  } else { // ? - b = c
    const resultVal = randInt(10, Math.floor(MAX_NUMBER * 0.5));
    b = randInt(1, Math.floor(MAX_NUMBER * 0.4));
    answer = resultVal + b;
    questionText = `? - ${b} = ${resultVal}`;
  }

  return {
    type: "fillBlank",
    text: "Tìm số còn thiếu:",
    equation: questionText,
    answer,
  };
}
