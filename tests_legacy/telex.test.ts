import { describe, it, expect } from "vitest";

import { TelexInputMethod } from "./telex";

describe("TelexInputMethod", () => {
  let telex: TelexInputMethod;

  beforeEach(() => {
    telex = new TelexInputMethod();
  });

  describe("basic vowel transformations", () => {
    it("should transform a + a to â", () => {
      expect(telex.process("a", "a")).toBe("â");
    });

    it("should transform a + w to ă", () => {
      expect(telex.process("a", "w")).toBe("ă");
    });

    it("should transform a + ^ to â", () => {
      expect(telex.process("a", "^")).toBe("â");
    });

    it("should transform e + e to ê", () => {
      expect(telex.process("e", "e")).toBe("ê");
    });

    it("should transform o + o to ô", () => {
      expect(telex.process("o", "o")).toBe("ô");
    });

    it("should transform o + w to ơ", () => {
      expect(telex.process("o", "w")).toBe("ơ");
    });

    it("should transform u + w to ư", () => {
      expect(telex.process("u", "w")).toBe("ư");
    });
  });

  describe("consonant transformations", () => {
    it("should transform d + d to đ", () => {
      expect(telex.process("d", "d")).toBe("đ");
    });
  });

  describe("tone mark transformations", () => {
    it("should transform a + s to á (sắc)", () => {
      expect(telex.process("a", "s")).toBe("á");
    });

    it("should transform a + f to à (huyền)", () => {
      expect(telex.process("a", "f")).toBe("à");
    });

    it("should transform a + r to ả (hỏi)", () => {
      expect(telex.process("a", "r")).toBe("ả");
    });

    it("should transform a + x to ã (ngã)", () => {
      expect(telex.process("a", "x")).toBe("ã");
    });

    it("should transform a + j to ạ (nặng)", () => {
      expect(telex.process("a", "j")).toBe("ạ");
    });
  });

  describe("complex transformations", () => {
    it("should handle vowel + tone combinations", () => {
      expect(telex.process("ă", "s")).toBe("ắ"); // ă + sắc
      expect(telex.process("â", "f")).toBe("ầ"); // â + huyền
      expect(telex.process("ơ", "j")).toBe("ợ"); // ơ + nặng
    });
  });

  describe("word processing", () => {
    it("should process simple words", () => {
      expect(telex.processWord("hocj")).toBe("học"); // c + j = ọ (tone on last vowel o)
      expect(telex.processWord("vietj")).toBe("viẹt"); // e + j = ẹ (tone on e)
      expect(telex.processWord("vieetj")).toBe("việt"); // ee = ê, then ê + j = ệ
      expect(telex.processWord("tieesng")).toBe("tiếng"); // ee = ê, then ê + s = ế
    });

    it("should handle complex words", () => {
      expect(telex.processWord("truowfng")).toBe("trường"); // uo = uô, w = ươ, f = ường
      expect(telex.processWord("hoaij")).toBe("hoại"); // tone j applied to last vowel (a)
      expect(telex.processWord("hoaif")).toBe("hoài"); // tone f applied to last vowel (i)
    });
  });

  describe("edge cases", () => {
    it("should not transform invalid combinations", () => {
      expect(telex.process("z", "z")).toBe("zz");
      expect(telex.process("b", "s")).toBe("bs");
    });

    it("should handle uppercase", () => {
      expect(telex.process("A", "A")).toBe("Â");
      expect(telex.process("A", "s")).toBe("Á");
    });
  });
});
