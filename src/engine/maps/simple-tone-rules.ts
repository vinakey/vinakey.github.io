/**
 * Simplified Vietnamese tone placement rules for TELEX
 * Focus on the most common patterns
 */

import { isVietnameseVowel } from "./vietnamese-chars";

/**
 * Find correct vowel for tone placement using simple heuristics
 */
export function findSimpleToneVowel(text: string): number {
  const vowelIndices: number[] = [];

  // Find all vowel positions
  for (let i = 0; i < text.length; i++) {
    if (isVietnameseVowel(text[i])) {
      vowelIndices.push(i);
    }
  }

  if (vowelIndices.length === 0) return -1;
  if (vowelIndices.length === 1) return vowelIndices[0];

  // For multiple vowels, use simplified Vietnamese rules based on actual word context
  const vowelSequence = vowelIndices.map((i) => text[i]).join("");

  // Special rule: if 'i' is the last vowel, place tone on the vowel before 'i'
  if (
    text[vowelIndices[vowelIndices.length - 1]].toLowerCase() === "i" &&
    vowelIndices.length >= 2
  ) {
    return vowelIndices[vowelIndices.length - 2];
  }

  // Special case handling for common patterns
  if (
    text.toLowerCase().includes("viet") ||
    text.toLowerCase().includes("yiet")
  ) {
    // In "việt", "yiết", etc., tone goes on 'e'
    const eIndex = text.toLowerCase().indexOf("e");

    if (eIndex !== -1 && vowelIndices.includes(eIndex)) {
      return eIndex;
    }
  }

  // Common Vietnamese diphthongs - tone placement rules
  switch (vowelSequence.toLowerCase()) {
    case "ai":
      return vowelIndices[1]; // tone on 'i'
    case "ao":
      return vowelIndices[0]; // tone on 'a' (corrected from 'o')
    case "au":
      return vowelIndices[1]; // tone on 'u'
    case "ay":
      return vowelIndices[0]; // tone on 'a' (corrected from 'y')
    case "eo":
      return vowelIndices[1]; // tone on 'o'
    case "eu":
      return vowelIndices[1]; // tone on 'u'
    case "ie":
      return vowelIndices[1]; // tone on 'e' (corrected)
    case "iu":
      return vowelIndices[1]; // tone on 'u'
    case "oa":
      return vowelIndices[1]; // tone on 'a'
    case "oai":
      return vowelIndices[1]; // tone on 'a' (triphthong: o-a-i)
    case "oe":
      return vowelIndices[1]; // tone on 'e'
    case "oi":
      return vowelIndices[1]; // tone on 'i'
    case "ou":
      return vowelIndices[1]; // tone on 'u'
    case "ua":
      return vowelIndices[1]; // tone on 'a'
    case "uay":
      return vowelIndices[1]; // tone on 'a' (in triphthong u-a-y)
    case "ue":
      return vowelIndices[1]; // tone on 'e'
    case "ui":
      return vowelIndices[1]; // tone on 'i'
    case "uy":
      return vowelIndices[1]; // tone on 'y'
    case "ya":
      return vowelIndices[1]; // tone on 'a'
    case "ye":
      return vowelIndices[1]; // tone on 'e'
    case "yo":
      return vowelIndices[1]; // tone on 'o'
    case "yu":
      return vowelIndices[1]; // tone on 'u'
    default:
      // For other patterns or single vowels, use the last vowel
      return vowelIndices[vowelIndices.length - 1];
  }
}
