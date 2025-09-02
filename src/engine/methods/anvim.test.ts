import { describe, it, expect, beforeEach } from "vitest";
import anvim, { AnvimEngine } from "./anvim";

describe("ANVIM - AVIM.js Compatible TELEX", () => {
  describe("Basic Vowel Transformations", () => {
    it("should handle double vowels", () => {
      expect(anvim("aa")).toBe("â");
      expect(anvim("ee")).toBe("ê");
      expect(anvim("oo")).toBe("ô");
      expect(anvim("AA")).toBe("Â");
      expect(anvim("EE")).toBe("Ê");
      expect(anvim("OO")).toBe("Ô");
    });

    it("should handle w-based transformations", () => {
      expect(anvim("aw")).toBe("ă");
      expect(anvim("ow")).toBe("ơ");
      expect(anvim("uw")).toBe("ư");
      expect(anvim("AW")).toBe("Ă");
      expect(anvim("OW")).toBe("Ơ");
      expect(anvim("UW")).toBe("Ư");
    });

    it("should handle âw → ă and ôw → ơ", () => {
      expect(anvim("aaw")).toBe("ă");
      expect(anvim("oow")).toBe("ơ");
      expect(anvim("AAW")).toBe("Ă");
      expect(anvim("OOW")).toBe("Ơ");
    });

    it("should handle dd → đ", () => {
      expect(anvim("dd")).toBe("đ");
      expect(anvim("DD")).toBe("Đ");
      expect(anvim("Dd")).toBe("Đ");
    });

    it("should handle special pattern uow → ươ", () => {
      expect(anvim("uow")).toBe("ươ");
      expect(anvim("UOW")).toBe("ƯƠ");
      expect(anvim("Uow")).toBe("Ươ");
      expect(anvim("tuow")).toBe("tươ");
      expect(anvim("duowc")).toBe("được");
      expect(anvim("thuowng")).toBe("thương");
    });
  });

  describe("Tone Mark Applications", () => {
    it("should apply sắc tone (s)", () => {
      expect(anvim("as")).toBe("á");
      expect(anvim("es")).toBe("é");
      expect(anvim("is")).toBe("í");
      expect(anvim("os")).toBe("ó");
      expect(anvim("us")).toBe("ú");
      expect(anvim("ys")).toBe("ý");
    });

    it("should apply huyền tone (f)", () => {
      expect(anvim("af")).toBe("à");
      expect(anvim("ef")).toBe("è");
      expect(anvim("if")).toBe("ì");
      expect(anvim("of")).toBe("ò");
      expect(anvim("uf")).toBe("ù");
      expect(anvim("yf")).toBe("ỳ");
    });

    it("should apply hỏi tone (r)", () => {
      expect(anvim("ar")).toBe("ả");
      expect(anvim("er")).toBe("ẻ");
      expect(anvim("ir")).toBe("ỉ");
      expect(anvim("or")).toBe("ỏ");
      expect(anvim("ur")).toBe("ủ");
      expect(anvim("yr")).toBe("ỷ");
    });

    it("should apply ngã tone (x)", () => {
      expect(anvim("ax")).toBe("ã");
      expect(anvim("ex")).toBe("ẽ");
      expect(anvim("ix")).toBe("ĩ");
      expect(anvim("ox")).toBe("õ");
      expect(anvim("ux")).toBe("ũ");
      expect(anvim("yx")).toBe("ỹ");
    });

    it("should apply nặng tone (j)", () => {
      expect(anvim("aj")).toBe("ạ");
      expect(anvim("ej")).toBe("ẹ");
      expect(anvim("ij")).toBe("ị");
      expect(anvim("oj")).toBe("ọ");
      expect(anvim("uj")).toBe("ụ");
      expect(anvim("yj")).toBe("ỵ");
    });
  });

  describe("Tone Placement - Single Vowels", () => {
    it("should place tone on single vowels", () => {
      expect(anvim("lys")).toBe("lý");
      expect(anvim("chir")).toBe("chỉ");
      expect(anvim("namf")).toBe("nàm");
    });
  });

  describe("Tone Placement - Diphthongs", () => {
    it("should handle ai/ay patterns (tone on first vowel)", () => {
      expect(anvim("mais")).toBe("mái");
      expect(anvim("layas")).toBe("lấy");
      expect(anvim("caays")).toBe("cấy");
      expect(anvim("trais")).toBe("trái");
    });

    it("should handle oi/oy patterns", () => {
      expect(anvim("tois")).toBe("tói");
      expect(anvim("moiws")).toBe("mới");
      expect(anvim("xoays")).toBe("xoáy");
    });

    it("should handle ao/au patterns", () => {
      expect(anvim("naof")).toBe("nào");
      expect(anvim("tauf")).toBe("tàu");
      expect(anvim("caauf")).toBe("cầu");
    });

    it("should handle eo/eu patterns", () => {
      expect(anvim("keos")).toBe("kéo");
      expect(anvim("yeeus")).toBe("yếu");
    });

    it("should handle ui/iu patterns", () => {
      expect(anvim("tuis")).toBe("túi");
      expect(anvim("tius")).toBe("tíu");
    });
  });

  describe("Tone Placement - Complex Words", () => {
    it("should handle words with circumflex/breve/horn", () => {
      expect(anvim("vieejt")).toBe("việt");
      expect(anvim("hoocj")).toBe("học");
      expect(anvim("nhaaf")).toBe("nhà");
      expect(anvim("truowfng")).toBe("trường");
      expect(anvim("nguowif")).toBe("người");
    });

    it("should handle tone placement with consonants", () => {
      expect(anvim("nhaaf")).toBe("nhà");
      expect(anvim("thuowngs")).toBe("thương");
      expect(anvim("ngayf")).toBe("ngày");
    });
  });

  describe("Order Flexibility", () => {
    it("should handle various typing orders", () => {
      // việt can be typed as vieet + j or viee + jt
      expect(anvim("vieetj")).toBe("việt");
      expect(anvim("vieejt")).toBe("việt");
      
      // được can be typed multiple ways
      expect(anvim("dduowcj")).toBe("được");
      expect(anvim("duowjc")).toBe("được");
    });

    it("should handle tone marks typed after all letters", () => {
      expect(anvim("nhungwx")).toBe("những");
      expect(anvim("nhungx")).toBe("nhũng");
    });
  });

  describe("Special Cases", () => {
    it("should handle qu correctly (u is not a vowel after q)", () => {
      expect(anvim("quas")).toBe("quá");
      expect(anvim("quanr")).toBe("quản");
      expect(anvim("queens")).toBe("quến");
    });

    it("should preserve non-Vietnamese patterns", () => {
      expect(anvim("xyz")).toBe("xyz");
      expect(anvim("bs")).toBe("bs");
      expect(anvim("wu")).toBe("wu");
    });

    it("should handle uppercase correctly", () => {
      expect(anvim("VIEEJT")).toBe("VIỆT");
      expect(anvim("Hoocj")).toBe("Học");
      expect(anvim("DDaij")).toBe("Đại");
    });
  });

  describe("Z-Clear Functionality", () => {
    it("should clear all diacritics with z", () => {
      expect(anvim("tiếngz")).toBe("tiengz");
      expect(anvim("việtz")).toBe("vietz");
      expect(anvim("nhàz")).toBe("nhaz");
    });
  });

  describe("Complex Real-World Examples", () => {
    it("should handle complex words correctly", () => {
      expect(anvim("ngauaf")).toBe("ngầu");
      expect(anvim("voiwf")).toBe("vời");
      expect(anvim("dduowcj")).toBe("được");
      expect(anvim("duwowcj")).toBe("dược");
      expect(anvim("truwowfng")).toBe("trường");
      expect(anvim("tuyeetj")).toBe("tuyệt");
    });
  });

  describe("Word Boundaries", () => {
    it("should process multiple words separately", () => {
      expect(anvim("hoocj sinhh")).toBe("học sinh");
      expect(anvim("vieejt namm")).toBe("việt nam");
      expect(anvim("ddaij hoocj")).toBe("đại học");
    });
  });

  describe("AnvimEngine class", () => {
    let engine: AnvimEngine;

    beforeEach(() => {
      engine = new AnvimEngine();
    });

    it("should process simple words", () => {
      expect(engine.processWord("hocj")).toBe("học");
      expect(engine.processWord("vietj")).toBe("viẹt");
      expect(engine.processWord("vieetj")).toBe("việt");
    });

    it("should handle incremental processing", () => {
      const result1 = engine.process("Tôi học ", "t");
      expect(result1.text).toBe("Tôi học t");
      
      const result2 = engine.process("Tôi học tiees", "n");
      expect(result2.text).toBe("Tôi học tiến");
    });

    it("should respect enabled/disabled state", () => {
      engine.setEnabled(false);
      expect(engine.processWord("aa")).toBe("aa");
      
      engine.setEnabled(true);
      expect(engine.processWord("aa")).toBe("â");
    });

    it("should get and set configuration", () => {
      const config = engine.getConfig();
      expect(config.method).toBe("TELEX");
      expect(config.enabled).toBe(true);
      
      engine.setConfig({ enabled: false });
      expect(engine.isEnabled()).toBe(false);
    });
  });
});