import { generateNumbers } from "./numbers-generator";

describe("Generates numbers", () => {
  it("Initializes new conversation", () => {
    const numbers = generateNumbers();

    expect(numbers.length).toBe(2);
    expect(numbers[0] + numbers[1]).toBeLessThanOrEqual(100);
  });
});
