export const isPositiveInt = (str?: string): boolean => {
  if (!str) return false;

  const allDigits = [...str].every((char) => char >= "0" && char <= "9");
  if (!allDigits) return false;

  return Number(str) > 0;
};
