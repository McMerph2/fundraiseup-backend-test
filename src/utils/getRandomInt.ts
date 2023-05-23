// Based on https://javascript.info/task/random-int-min-max

export const getRandomInt = (min: number, max: number) => {
  // Here rand is from min to (max+1)
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};
