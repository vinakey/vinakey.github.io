import { describe, it, expect } from "vitest";

import { TelexInputMethod } from "./telex";

describe("Test long-distance vowel doubling", () => {
  let telex: TelexInputMethod;

  beforeEach(() => {
    telex = new TelexInputMethod();
  });

  it("should handle various long-distance vowel combinations", () => {
    console.log("\n=== TESTING LONG-DISTANCE VOWEL DOUBLING ===");

    const testCases = [
      // o + o cases
      ["ngono", "ngôn"], // ng-o-n-o → ng-ô-n ✅
      ["koko", "kôko"], // k-o-k-o → k-ô-ko (should only transform first)
      ["toto", "tôto"], // t-o-t-o → t-ô-to

      // a + a cases
      ["kana", "kăna"], // k-a-n-a → k-ă-na
      ["mama", "măma"], // m-a-m-a → m-ă-ma

      // e + e cases
      ["kene", "kêne"], // k-e-n-e → k-ê-ne
      ["tete", "tête"], // t-e-t-e → t-ê-te

      // u + u cases
      ["kunu", "kūnu"], // This might not work since uu doesn't have a transform

      // Should NOT transform (too far apart or vowels in between)
      ["nonono", "nonôno"], // Should transform first o+o, leave last o
      ["noano", "noano"], // n-o-a-n-o → should not transform (vowel 'a' in between)
    ];

    testCases.forEach(([input, expected]) => {
      const result = telex.processWord(input);
      const matches = result === expected;

      console.log(
        `"${input}" → "${result}" ${matches ? "✅" : "❌"} ${matches ? "" : `(expected: "${expected}")`}`,
      );

      if (!matches) {
        // Show step-by-step for failing cases
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
  });

  it("should ensure core tests still pass", () => {
    console.log("\n=== ENSURING CORE FUNCTIONALITY STILL WORKS ===");

    const coreCases = [
      ["ngoon", "ngôn"], // normal double o
      ["aa", "â"], // normal double a
      ["ee", "ê"], // normal double e
      ["Vieetj", "Việt"], // complex case
      ["hoaij", "hoại"], // complex tone case
    ];

    coreCases.forEach(([input, expected]) => {
      const result = telex.processWord(input);
      const matches = result === expected;

      console.log(`"${input}" → "${result}" ${matches ? "✅" : "❌"}`);
      expect(result).toBe(expected);
    });
  });
});
