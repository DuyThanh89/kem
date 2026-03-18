import { makeArithmetic } from './arithmetic';
import { makeClock } from './clock';
import { makeWordProblem } from './word';
import { makeFillBlank } from './fillBlank';
import { makeCompare } from './compare';
import { 
  makeMeasurement, makeMoney, makeSorting, 
  makePattern, makePerimeter, makeRounding,
  makeCalendar, makeDuration, makeShapes,
  makeDrawClock, makeArea
} from './advanced';

const GENERATORS = {
  arithmetic: makeArithmetic,
  clock: makeClock,
  word: makeWordProblem,
  fillBlank: makeFillBlank,
  compare: makeCompare,
  measurement: makeMeasurement,
  money: makeMoney,
  sorting: makeSorting,
  pattern: makePattern,
  perimeter: makePerimeter,
  rounding: makeRounding,
  calendar: makeCalendar,
  duration: makeDuration,
  shapes: makeShapes,
  drawClock: makeDrawClock,
  area: makeArea,
};

export function generateQuiz(type, count = 10) {
  const generator = GENERATORS[type];
  if (!generator) {
    console.warn(`No generator for type: ${type}`);
    return [];
  }

  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      id: `${type}-${Date.now()}-${i}`,
      ...generator()
    });
  }
  return questions;
}
