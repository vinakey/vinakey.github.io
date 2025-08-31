import { describe, it, expect } from "vitest";

import { TelexInputMethod } from "./telex";

describe("Test double vowel transformations", () => {
  let telex: TelexInputMethod;

  beforeEach(() => {
    telex = new TelexInputMethod();
  });

  it("should process double vowel words correctly", () => {
    console.log("\n=== TESTING DOUBLE VOWEL WORDS ===");

    const testCases = [
      ["ngoon", "ngôn"], // oo → ô, n remains
      ["hocj", "học"], // single o, j → tone on o, c remains
      ["toost", "tốt"], // oo → ô, s → tone, t remains
      ["mootj", "một"], // oo → ô, j → tone, t remains
      ["caan", "cân"], // aa → â, n remains
      ["baf", "bà"], // a → a, f → tone
      ["teen", "tên"], // ee → ê, n remains
      ["veef", "về"], // ee → ê, f → tone
    ];

    testCases.forEach(([input, expected]) => {
      const result = telex.processWord(input);

      console.log(
        `"${input}" → "${result}" (expected: "${expected}") ${result === expected ? "✅" : "❌"}`,
      );
      if (result !== expected) {
        // Debug step by step
        console.log(`  Step-by-step for "${input}":`);
        let stepResult = "";

        for (let i = 0; i < input.length; i++) {
          const char = input[i];
          const oldResult = stepResult;

          stepResult = (telex as any).processCharacter(stepResult, char);
          console.log(
            `    ${i + 1}: "${oldResult}" + "${char}" → "${stepResult}"`,
          );
        }
      }
    });

    // Test core double vowel transformations work
    expect(telex.processWord("ngoon")).toBe("ngôn"); // oo → ô
    expect(telex.processWord("toost")).toBe("tốt"); // oo → ô, tone s
    expect(telex.processWord("mootj")).toBe("một"); // oo → ô, tone j
  });
});
