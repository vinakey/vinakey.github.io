# TELEX Vietnamese Input Method - Complete Rules Documentation

TELEX (Telex) is a Vietnamese input method that uses ASCII characters to represent Vietnamese diacritics and special characters.

## Basic Principles

1. **Base Letter + Modifier**: Type a base letter followed by modifier characters to add diacritics
2. **Double Letters**: Type the same letter twice to add circumflex (hat)
3. **W Modifier**: Use 'w' to add horn/breve marks
4. **Tone Letters**: Use f, r, x, s, j for tone marks

## Vowel Transformations

### Circumflex (Dấu Mũ) - Type letter twice
- `aa` → `â` (e.g., "caan" → "cân")
- `ee` → `ê` (e.g., "ddeem" → "đêm") 
- `oo` → `ô` (e.g., "nhoo" → "nhô")

### Horn/Breve (Dấu Móc/Dấu Trăng) - Use 'w'
- `aw` → `ă` (e.g., "trawng" → "trăng")
- `ow` → `ơ` (e.g., "mow" → "mơ")
- `uw` → `ư` (e.g., "tuw" → "tư")
- Alternative: `w` alone → `ư` (e.g., "tw" → "tư")

### Special Cases
- `uow` → `ươ` (horn on both u and o)
- `uoo` → `uô` (circumflex on o after u)

## Consonant Transformations

- `dd` → `đ` (e.g., "ddaau" → "đâu")

## Tone Marks

Add these at the end of syllables or after vowels:

- `s` → Sắc (acute): á, é, í, ó, ú, ý
- `f` → Huyền (grave): à, è, ì, ò, ù, ỳ  
- `r` → Hỏi (hook): ả, ẻ, ỉ, ỏ, ủ, ỷ
- `x` → Ngã (tilde): ã, ẽ, ĩ, õ, ũ, ỹ
- `j` → Nặng (dot below): ạ, ẹ, ị, ọ, ụ, ỵ

## Tone Placement Rules

Vietnamese follows specific rules for tone placement:

1. **Single vowel**: Tone goes on the vowel (e.g., `as` → `á`)
2. **Multiple vowels**: 
   - If 'i' or 'u' is at the end, tone goes on the vowel before it
   - Otherwise, tone goes on the first vowel
3. **Special vowels (â, ă, ê, ô, ơ, ư)**: Tone goes directly on the special vowel

## Complex Examples

- `Tieesng` → `Tiếng` (ee→ê, s→sắc tone on ê, ng remains)
- `Vieetj` → `Việt` (ee→ê, j→nặng tone on ê, t remains)
- `dduowcj` → `được` (dd→đ, uo→ươ, j→nặng tone on ơ, c remains)
- `nhaanj` → `nhận` (aa→â, nj→n with nặng tone on â)
- `hoaij` → `hoại` (oai→oai, j→nặng tone on a since i is last)

## Advanced Features

- **Tone Override**: If multiple tone keys are pressed, the last one is used
- **Delete Diacritics**: Use 'z' to remove previously added diacritics
- **Double Tone Keys**: Type twice to write the tone key as literal (e.g., "ss" → "s")

## Implementation Notes

1. Process character-by-character as user types
2. Apply vowel/consonant transformations first
3. Apply tone marks after base transformations
4. Respect Vietnamese syllable structure for tone placement
5. Handle word boundaries (space, punctuation) to reset processing

## Common Patterns

- Words ending in -ng: tone usually goes on main vowel before ng
- Words ending in consonants: tone goes on main vowel  
- Diphthongs (ai, ao, au): tone placement follows Vietnamese rules
- Long-distance modifications: some transformations can span consonants (e.g., ngono → ngôn)