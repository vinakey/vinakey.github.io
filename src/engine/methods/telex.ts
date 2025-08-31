/**
 * TELEX Vietnamese Input Method Implementation
 *
 * Supports all Vietnamese diacritics and tones:
 * - Vowel doubling: aa→â, ee→ê, oo→ô
 * - Vowel extensions: aw→ă, ow→ơ, uw→ư
 * - Consonant transformation: dd→đ
 * - Tone marks: s→́ (sắc), f→̀ (huyền), r→̉ (hỏi), x→̃ (ngã), j→̣ (nặng)
 * - Complex combinations: uow→ươ, uoo→uô
 * - Long-distance vowel doubling: ngono→ngôn
 */
import { isVietnameseVowel } from "../maps/vietnamese-chars";
import { findSimpleToneVowel } from "../maps/simple-tone-rules";

interface TelexTransformation {
  base: string;
  modifier: string;
  result: string;
}

export class TelexInputMethod {
  private readonly vowelTransforms: TelexTransformation[] = [
    // a transformations
    { base: "a", modifier: "a", result: "â" }, // aa -> â (circumflex)
    { base: "a", modifier: "w", result: "ă" }, // aw -> ă (breve)
    { base: "a", modifier: "^", result: "â" },
    { base: "A", modifier: "A", result: "Â" },
    { base: "A", modifier: "a", result: "Â" }, // mixed case A+a -> Â
    { base: "A", modifier: "w", result: "Ă" },
    { base: "A", modifier: "^", result: "Â" },

    // e transformations
    { base: "e", modifier: "e", result: "ê" },
    { base: "E", modifier: "e", result: "Ê" },
    { base: "E", modifier: "E", result: "Ê" },

    // o transformations
    { base: "o", modifier: "o", result: "ô" },
    { base: "o", modifier: "w", result: "ơ" },
    { base: "O", modifier: "o", result: "Ô" },
    { base: "O", modifier: "O", result: "Ô" },
    { base: "O", modifier: "w", result: "Ơ" },

    // u transformations
    { base: "u", modifier: "w", result: "ư" },
    { base: "U", modifier: "w", result: "Ư" },

    // Vowel combination transformations (must be processed first)
    { base: "uo", modifier: "o", result: "uô" }, // uo + o = uô
    { base: "uo", modifier: "w", result: "ươ" }, // uo + w = ươ
    { base: "UO", modifier: "o", result: "UÔ" },
    { base: "UO", modifier: "w", result: "ƯƠ" },
  ];

  private readonly consonantTransforms: TelexTransformation[] = [
    { base: "d", modifier: "d", result: "đ" },
    { base: "D", modifier: "d", result: "Đ" },
    { base: "D", modifier: "D", result: "Đ" },
  ];

  private readonly toneMap: { [key: string]: string } = {
    s: "\u0301", // ́ sắc (acute)
    f: "\u0300", // ̀ huyền (grave)
    r: "\u0309", // ̉ hỏi (hook above)
    x: "\u0303", // ̃ ngã (tilde)
    j: "\u0323", // ̣ nặng (dot below)
  };

  /**
   * Process character transformation (handles both single and multi-character vowel combos)
   */
  public process(base: string, modifier: string): string {
    // Handle multi-character Vietnamese vowel combinations first
    if (base.length > 1 && modifier.length === 1) {
      const vowelTransform = this.vowelTransforms.find(
        (t) => t.base === base && t.modifier === modifier,
      );

      if (vowelTransform) {
        return vowelTransform.result;
      }

      // For multi-character base that's not a vowel combo, no transformation
      return base + modifier;
    }

    // Only process single character combinations for other cases
    if (base.length !== 1 || modifier.length !== 1) {
      return base + modifier;
    }

    // Check vowel transformations first
    const vowelTransform = this.vowelTransforms.find(
      (t) => t.base === base && t.modifier === modifier,
    );

    if (vowelTransform) {
      return vowelTransform.result;
    }

    // Check consonant transformations
    const consonantTransform = this.consonantTransforms.find(
      (t) => t.base === base && t.modifier === modifier,
    );

    if (consonantTransform) {
      return consonantTransform.result;
    }

    // Check tone mark transformations - for any Vietnamese vowel
    if (this.toneMap[modifier] && this.canAcceptTone(base)) {
      return this.addToneMark(base, this.toneMap[modifier]);
    }

    // No transformation found, return concatenation
    return base + modifier;
  }

  /**
   * Add tone mark to a character (preserving existing diacritics like breve, circumflex)
   */
  private addToneMark(base: string, toneMark: string): string {
    // Normalize to decomposed form
    const normalized = base.normalize("NFD");

    // Remove only existing tone marks (not other diacritics like breve, circumflex, horn)
    // Tone marks: 0300 (grave), 0301 (acute), 0303 (tilde), 0309 (hook above), 0323 (dot below)
    const withoutTones = normalized.replace(
      /[\u0300\u0301\u0303\u0309\u0323]/g,
      "",
    );

    // Add new tone mark and normalize back
    return (withoutTones + toneMark).normalize("NFC");
  }

  /**
   * Process a complete word using TELEX sequential processing
   */
  public processWord(input: string): string {
    let result = "";

    for (const char of input) {
      result = this.processCharacter(result, char);
    }

    return result;
  }

  /**
   * Process a single character against the current result
   */
  private processCharacter(current: string, newChar: string): string {
    if (!current) return newChar;

    // For tone marks, try contextual tone placement first (before single-char transformations)
    if (this.toneMap[newChar]) {
      const toneResult = this.applyToneToLastVowel(current, newChar);

      if (toneResult !== current) {
        return toneResult;
      }
    }

    // Special case: long-distance vowel doubling (e.g., ngono → ngôn)
    if (this.isVowelDoublingChar(newChar)) {
      const longDistanceResult = this.tryLongDistanceVowelDoubling(
        current,
        newChar,
      );

      if (longDistanceResult !== current + newChar) {
        return longDistanceResult;
      }
    }

    // Try multi-character vowel combinations (like uo + w = ươ) but exclude single-char tone transformations
    for (let len = Math.min(current.length, 3); len >= 1; len--) {
      const suffix = current.slice(-len);
      const combination = this.process(suffix, newChar);

      // Skip if this is just a single character tone transformation (handled above)
      if (len === 1 && this.toneMap[newChar]) {
        continue;
      }

      if (combination !== suffix + newChar) {
        return current.slice(0, -len) + combination;
      }
    }

    // No transformation, just append
    return current + newChar;
  }

  /**
   * Apply tone mark to the correct vowel in the current text
   */
  private applyToneToLastVowel(text: string, toneChar: string): string {
    const tone = this.toneMap[toneChar];

    if (!tone) return text;

    // Use simple Vietnamese tone rules to find the correct vowel
    const vowelIndex = findSimpleToneVowel(text);

    if (vowelIndex !== -1) {
      const before = text.substring(0, vowelIndex);
      const vowel = text[vowelIndex];
      const after = text.substring(vowelIndex + 1);

      return before + this.addToneMark(vowel, tone) + after;
    }

    return text; // No vowel found
  }

  /**
   * Check if a character can accept a tone mark
   */
  private canAcceptTone(char: string): boolean {
    return isVietnameseVowel(char);
  }

  /**
   * Check if the character is a vowel that can double with the same vowel
   */
  private isVowelDoublingChar(char: string): boolean {
    return ["a", "A", "e", "E", "o", "O", "u", "U"].includes(char);
  }

  /**
   * Try long-distance vowel doubling (e.g., ngono → ngôn, where o + o across consonant)
   */
  private tryLongDistanceVowelDoubling(
    current: string,
    newChar: string,
  ): string {
    // Look for the same vowel earlier in the string, allowing up to 2 consonants in between
    for (
      let lookback = 2;
      lookback <= Math.min(4, current.length);
      lookback++
    ) {
      const pos = current.length - lookback;

      if (pos < 0) break;

      const earlierChar = current[pos];

      // Check if it's the same vowel (case-insensitive comparison)
      if (earlierChar.toLowerCase() === newChar.toLowerCase()) {
        // Make sure there are only consonants between them
        const between = current.slice(pos + 1);
        const isOnlyConsonants = [...between].every(
          (c) => !isVietnameseVowel(c),
        );

        if (isOnlyConsonants) {
          // Apply the doubling transformation
          const doubled = this.process(earlierChar, newChar);

          if (doubled !== earlierChar + newChar) {
            // Replace the earlier vowel with the doubled version
            return current.slice(0, pos) + doubled + between;
          }
        }
      }
    }

    return current + newChar; // No long-distance doubling found
  }
}
