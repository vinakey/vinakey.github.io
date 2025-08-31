/**
 * Vietnamese Syllable Rules and Tone Placement Logic
 *
 * References Vietnamese phonology and orthography rules:
 * - Main vowel identification
 * - Tone placement on correct vowel in diphthongs/triphthongs
 * - Syllable boundary detection
 */

import { isVietnameseVowel } from "./vietnamese-chars";

/**
 * Vietnamese vowel combinations that form diphthongs/triphthongs
 * The SECOND vowel typically receives the tone mark
 */
export const VIETNAMESE_DIPHTHONGS = {
  // Two-vowel combinations where 2nd vowel gets tone
  ai: 1, // ái, ải, etc. - tone on 'i'
  ao: 1, // áo, ào, etc. - tone on 'o'
  au: 1, // áu, àu, etc. - tone on 'u'
  ay: 1, // áy, ày, etc. - tone on 'y'
  eo: 1, // éo, èo, etc. - tone on 'o'
  eu: 1, // éu, èu, etc. - tone on 'u'
  ie: 0, // íe, ìe, etc. - tone on 'i'
  oa: 1, // óa, òa, etc. - tone on 'a'
  oe: 1, // óe, òe, etc. - tone on 'e'
  oo: 1, // óo, òo, etc. - tone on second 'o'
  ou: 1, // óu, òu, etc. - tone on 'u'
  ua: 1, // úa, ùa, etc. - tone on 'a'
  ue: 1, // úe, ùe, etc. - tone on 'e'
  ui: 1, // úi, ùi, etc. - tone on 'i'
  uy: 1, // úy, ùy, etc. - tone on 'y'
  ya: 1, // ýa, ỳa, etc. - tone on 'a'
  ye: 1, // ýe, ỳe, etc. - tone on 'e'
  yo: 1, // ýo, ỳo, etc. - tone on 'o'
  yu: 1, // ýu, ỳu, etc. - tone on 'u'

  // Special Vietnamese combinations
  iê: 1, // iế, iề, etc. - tone on 'ê'
  uô: 1, // uố, uồ, etc. - tone on 'ô'
  ươ: 1, // ướ, ường, etc. - tone on 'ơ'
} as const;

/**
 * Triphthongs - three vowel combinations
 * Index indicates which vowel gets the tone (0-based)
 */
export const VIETNAMESE_TRIPHTHONGS = {
  iêu: 1, // iếu, iều, etc. - tone on 'ê'
  ươi: 1, // ưới, ười, etc. - tone on 'ơ'
  uôi: 1, // uối, uồi, etc. - tone on 'ô'
  oai: 1, // oái, oài, etc. - tone on 'a'
  uay: 1, // uáy, uày, etc. - tone on 'a'
} as const;

/**
 * Find the correct vowel to place tone mark in a Vietnamese syllable
 */
export function findToneVowelIndex(text: string): number {
  const vowels = extractVowelSequence(text);

  if (!vowels) return -1;

  const { sequence, startIndex } = vowels;
  const lowerSequence = sequence.toLowerCase();

  // Check for triphthongs first (longest matches)
  for (const [triphthong, toneIndex] of Object.entries(
    VIETNAMESE_TRIPHTHONGS,
  )) {
    if (lowerSequence.includes(triphthong)) {
      const triphthongStart = lowerSequence.indexOf(triphthong);

      return startIndex + triphthongStart + toneIndex;
    }
  }

  // Check for diphthongs (find the longest match first)
  const diphthongs = Object.entries(VIETNAMESE_DIPHTHONGS).sort(
    ([a], [b]) => b.length - a.length,
  ); // Sort by length, longest first

  for (const [diphthong, toneIndex] of diphthongs) {
    const index = lowerSequence.indexOf(diphthong);

    if (index !== -1) {
      return startIndex + index + toneIndex;
    }
  }

  // Single vowel or unknown pattern - use last vowel
  return findLastVowelIndex(text);
}

/**
 * Extract the vowel sequence from text and its position
 */
function extractVowelSequence(
  text: string,
): { sequence: string; startIndex: number } | null {
  let startIndex = -1;
  let sequence = "";

  for (let i = 0; i < text.length; i++) {
    if (isVietnameseVowel(text[i])) {
      if (startIndex === -1) startIndex = i;
      sequence += text[i];
    } else if (sequence) {
      // Found end of vowel sequence
      break;
    }
  }

  return sequence ? { sequence, startIndex } : null;
}

/**
 * Find the last vowel index in text (fallback for unknown patterns)
 */
export function findLastVowelIndex(text: string): number {
  for (let i = text.length - 1; i >= 0; i--) {
    if (isVietnameseVowel(text[i])) {
      return i;
    }
  }

  return -1;
}

/**
 * Check if a character sequence contains Vietnamese vowels
 */
export function containsVietnameseVowel(text: string): boolean {
  return text.split("").some((char) => isVietnameseVowel(char));
}
