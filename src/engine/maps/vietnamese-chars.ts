/**
 * Vietnamese Character Mappings and Utilities
 */

export const VIETNAMESE_VOWELS = [
  // Basic vowels
  "a",
  "e",
  "i",
  "o",
  "u",
  "y",
  // Vietnamese specific vowels
  "ă",
  "â",
  "ê",
  "ô",
  "ơ",
  "ư",
  // Upper case variants
  "A",
  "E",
  "I",
  "O",
  "U",
  "Y",
  "Ă",
  "Â",
  "Ê",
  "Ô",
  "Ơ",
  "Ư",
] as const;

export const VIETNAMESE_CONSONANTS = [
  "b",
  "c",
  "d",
  "đ",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "q",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "z",
] as const;

/**
 * Vietnamese tone marks (combining characters)
 * Order: none, sắc, huyền, hỏi, ngã, nặng
 */
export const TONE_MARKS = [
  "", // no tone
  "\u0301", // ́ sắc (acute)
  "\u0300", // ̀ huyền (grave)
  "\u0309", // ̉ hỏi (hook above)
  "\u0303", // ̃ ngã (tilde)
  "\u0323", // ̣ nặng (dot below)
] as const;

export type VietnameseVowel = (typeof VIETNAMESE_VOWELS)[number];
export type VietnameseConsonant = (typeof VIETNAMESE_CONSONANTS)[number];
export type ToneMark = (typeof TONE_MARKS)[number];

/**
 * Check if a character is a Vietnamese tone mark
 */
export function isToneMark(char: string): char is ToneMark {
  return char !== "" && TONE_MARKS.includes(char as ToneMark);
}

/**
 * Check if a character is a Vietnamese vowel (handles composed characters)
 */
export function isVietnameseVowel(char: string): char is VietnameseVowel {
  if (!char) return false;

  // Check direct match first
  if (VIETNAMESE_VOWELS.includes(char as VietnameseVowel)) {
    return true;
  }

  // For composed characters (base + tone marks), check the base character
  const normalized = char.normalize("NFD");
  const baseChar = normalized[0]; // First character is the base

  return VIETNAMESE_VOWELS.includes(baseChar as VietnameseVowel);
}

/**
 * Check if a character is a Vietnamese consonant
 */
export function isVietnameseConsonant(
  char: string,
): char is VietnameseConsonant {
  return VIETNAMESE_CONSONANTS.includes(
    char.toLowerCase() as VietnameseConsonant,
  );
}
