import { randomInt } from "node:crypto";

const getRandomChar = () => {
  // https://www.cs.cmu.edu/~pattis/15-1XX/common/handouts/ascii.html
  const uppercase = [65, 90] as const;
  const lowercase = [97, 122] as const;
  const digits = [48, 57] as const;

  const [min, max] = [uppercase, lowercase, digits][randomInt(0, 3)]!;

  return String.fromCharCode(randomInt(min, max));
};

export const getRandomStr = (length: number) =>
  Array.from({ length }).map(getRandomChar).join("");
