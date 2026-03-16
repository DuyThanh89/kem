export const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const rand = randInt;
export const MAX_NUMBER = 100000;

export const pick = (array) => array[Math.floor(Math.random() * array.length)];

export const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return num;
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};
