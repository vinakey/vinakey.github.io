/**
 * Vietnamese Syllable Rules and Tone Placement Logic
 *
 * Based on Vietnamese phonology from Wikipedia:
 * https://en.wikipedia.org/wiki/Vietnamese_phonology
 *
 * Diphthongs and triphthongs are categorized as:
 * A) Falling/centering diphthongs: ia/iê, ua/uô, ưa/ươ
 * B) Closing diphthongs ending in -i/-y: ai, ay, ây, oi, ôi, ơi, ui, ưi
 * C) Closing diphthongs ending in -u/-o: ao, au, âu, eo, êu, iu, ưu
 * D) Medial "w"-type vowel clusters: oa, oă, oe, uê, uy, uâ, uă
 *
 * Triphthongs:
 * - Core: iêu/yêu, uôi, ươi, ươu
 * - With initial onglide: oai/uai, oay/uay, uya, uyê
 */

import { isVietnameseVowel } from "./vietnamese-chars";

/**
 * Vietnamese diphthongs with tone placement index
 * Based on actual Vietnamese orthography rules
 */
export const VIETNAMESE_DIPHTHONGS = {
  // Group A: Falling/centering diphthongs
  ia: 0, // mía → tone on 'i'
  iê: 1, // tiền → tone on 'ê'
  ua: 0, // múa → tone on 'u'
  uô: 1, // buồn → tone on 'ô'
  ưa: 0, // mứa → tone on 'ư'
  ươ: 1, // dược → tone on 'ơ'

  // Group B: Closing diphthongs ending in -i/-y
  ai: 0, // mái → tone on 'a'
  ay: 0, // cây → tone on 'a'
  ây: 0, // cấy → tone on 'â'
  oi: 0, // tôi → tone on 'o'
  ôi: 0, // nổi → tone on 'ô'
  ơi: 0, // mới → tone on 'ơ'
  ui: 0, // túi → tone on 'u'
  ưi: 0, // cửi → tone on 'ư'

  // Group C: Closing diphthongs ending in -u/-o
  ao: 0, // nào → tone on 'a'
  au: 0, // tàu → tone on 'a'
  âu: 0, // cầu → tone on 'â'
  eo: 0, // kéo → tone on 'e'
  êu: 0, // yêu → tone on 'ê'
  iu: 0, // tíu → tone on 'i'
  ưu: 0, // cứu → tone on 'ư'

  // Group D: Medial "w"-type vowel clusters
  oa: 0, // hóa → tone on 'o'
  oă: 1, // hoẳn → tone on 'ă'
  oe: 0, // khóe → tone on 'o'
  uê: 1, // quên → tone on 'ê'
  uy: 0, // thúy → tone on 'u'
  uâ: 1, // quân → tone on 'â'
  uă: 1, // quặn → tone on 'ă'
} as const;

/**
 * Vietnamese triphthongs with tone placement index
 */
export const VIETNAMESE_TRIPHTHONGS = {
  // Core triphthongs
  iêu: 1, // chiều → tone on 'ê'
  ieu: 1, // Alternative form of iêu before transformation
  yêu: 1, // yếu → tone on 'ê'
  yeu: 1, // Alternative form of yêu before transformation
  uôi: 1, // cười → tone on 'ô'
  uoi: 1, // Alternative form of uôi before transformation
  ươi: 1, // tười → tone on 'ơ'
  ươu: 1, // hướu → tone on 'ơ'

  // With initial onglide
  oai: 1, // hoài → tone on 'a'
  uai: 1, // quái → tone on 'a' (after qu-)
  oay: 1, // xoáy → tone on 'a'
  uay: 1, // quây → tone on 'a' (after qu-)
  uya: 1, // khuya → tone on 'a'
  uyê: 2, // tuyết → tone on 'ê'
  uye: 2, // Alternative form of uyê before transformation
} as const;

/**
 * Find the correct vowel to place tone mark in a Vietnamese syllable
 */
export function findToneVowelIndex(text: string): number {
  const vowels = extractVowelSequenceSkippingQu(text);

  if (!vowels) return -1;

  const { sequence, startIndex } = vowels;
  const normalizedSequence = sequence.normalize("NFC");
  const lowerSequence = normalizedSequence.toLowerCase();

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
  );

  for (const [diphthong, toneIndex] of diphthongs) {
    const index = lowerSequence.indexOf(diphthong);

    if (index !== -1) {
      return startIndex + index + toneIndex;
    }
  }

  // Quality diacritic priority: if sequence contains diacritic vowels, place tone there
  const diacriticPriority = [
    "ă",
    "â",
    "ê",
    "ô",
    "ơ",
    "ư",
    "Ă",
    "Â",
    "Ê",
    "Ô",
    "Ơ",
    "Ư",
  ];

  for (let i = 0; i < normalizedSequence.length; i++) {
    if (diacriticPriority.includes(normalizedSequence[i])) {
      return startIndex + i;
    }
  }

  // Single vowel or unknown pattern - use last vowel
  return findLastVowelIndex(text);
}

/**
 * Extract the vowel sequence from text and its position
 */
function extractVowelSequenceSkippingQu(
  text: string,
): { sequence: string; startIndex: number } | null {
  let startIndex = -1;
  let sequence = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const prev = i > 0 ? text[i - 1] : "";

    // Treat 'u' after 'q' as consonant (part of consonant cluster 'qu')
    const isQuU =
      (char === "u" || char === "U") && (prev === "q" || prev === "Q");

    if (isVietnameseVowel(char) && !isQuU) {
      if (startIndex === -1) startIndex = i;
      sequence += char;
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
