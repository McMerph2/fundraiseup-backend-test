import { isPositiveInt } from "./isPositiveInt";

describe("isPositiveInt()", () => {
  test("returns true if positive int", () => {
    expect(isPositiveInt("1")).toBe(true);
    expect(isPositiveInt("42")).toBe(true);
  });

  test("returns false if not positive int", () => {
    expect(isPositiveInt()).toBe(false);
    expect(isPositiveInt("")).toBe(false);
    expect(isPositiveInt("-42")).toBe(false);
    expect(isPositiveInt("-1")).toBe(false);
    expect(isPositiveInt("-0")).toBe(false);
    expect(isPositiveInt("-0.1")).toBe(false);
    expect(isPositiveInt("-0.00001")).toBe(false);
    expect(isPositiveInt("42.228")).toBe(false);
    expect(isPositiveInt("-42.228")).toBe(false);
  });
});
