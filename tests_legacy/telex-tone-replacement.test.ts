import { describe, it, expect } from 'vitest';
import telex from './telex';

// Tone replacement tests: when a new tone key is typed after a toned syllable,
// the existing tone should be replaced on the correct vowel, preserving quality diacritics.

describe('TELEX Tone Replacement', () => {
  it('should replace acute with grave: tusf -> tù', () => {
    expect(telex('tus')).toBe('tú');
    expect(telex('tusf')).toBe('tù');
  });

  it('should replace tone on quality vowel: taasy -> tấy, then tayf -> tày', () => {
    expect(telex('taasy')).toBe('tấy');
    expect(telex('tayf')).toBe('tày');
  });

  it('should replace tone within a word: nguyexnr -> nguyển, then nguyexnf -> nguyền', () => {
    expect(telex('nguyeenjr')).toBe('nguyển');
    expect(telex('nguyeenrf')).toBe('nguyền');
  });

  it('should replace tone for ê: vieesr -> viể, vieesf -> viề', () => {
    expect(telex('vieesr')).toBe('viể');
    expect(telex('vieesf')).toBe('viề');
  });

  it('should toggle off when same tone key typed twice: tuff -> tuf', () => {
    expect(telex('tuf')).toBe('tù');
    expect(telex('tuff')).toBe('tuf');
  });

  it('should transform muwa to mưa (not muă)', () => {
    expect(telex('muwa')).toBe('mưa');
  });

  it('should ignore quality if repeated base typed: leee -> lee', () => {
    expect(telex('lee')).toBe('lê');
    expect(telex('leee')).toBe('lee');
  });
});
