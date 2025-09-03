/**
 * ANVIM - Direct TypeScript migration of AVIM.js
 * Vietnamese Input Method Engine
 *
 * Based on AVIM JavaScript Vietnamese Input Method by Hieu Tran Dang
 * Migrated to TypeScript while preserving exact logic and behavior
 */

export interface AvimConfig {
  method: number; // 0=AUTO, 1=TELEX, 2=VNI, 3=VIQR, 4=VIQR*
  onOff: number; // 0=Off, 1=On
  ckSpell: number; // 0=Off, 1=On
  oldAccent: number; // 0: New way (oa`, oe`, uy`), 1: Old way (o`a, o`e, u`y)
}

export type VietnameseInputMethod =
  | "AUTO"
  | "TELEX"
  | "VNI"
  | "VIQR"
  | "VIQR*"
  | "OFF";

export class AnvimEngine {
  // Core AVIM properties and character maps
  private whit: boolean = false;

  private skey: number[] = [
    97, 226, 259, 101, 234, 105, 111, 244, 417, 117, 432, 121, 65, 194, 258, 69,
    202, 73, 79, 212, 416, 85, 431, 89,
  ];
  private db1: number[] = [273, 272];
  private ds1: string[] = ["d", "D"];
  private os1: string[] =
    "o,O,ơ,Ơ,ó,Ó,ò,Ò,ọ,Ọ,ỏ,Ỏ,õ,Õ,ớ,Ớ,ờ,Ờ,ợ,Ợ,ở,Ở,ỡ,Ỡ".split(",");
  private ob1: string[] =
    "ô,Ô,ô,Ô,ố,Ố,ồ,Ồ,ộ,Ộ,ổ,Ổ,ỗ,Ỗ,ố,Ố,ồ,Ồ,ộ,Ộ,ổ,Ổ,ỗ,Ỗ".split(",");
  private mocs1: string[] =
    "o,O,ô,Ô,u,U,ó,Ó,ò,Ò,ọ,Ọ,ỏ,Ỏ,õ,Õ,ú,Ú,ù,Ù,ụ,Ụ,ủ,Ủ,ũ,Ũ,ố,Ố,ồ,Ồ,ộ,Ộ,ổ,Ổ,ỗ,Ỗ".split(
      ",",
    );
  private mocb1: string[] =
    "ơ,Ơ,ơ,Ơ,ư,Ư,ớ,Ớ,ờ,Ờ,ợ,Ợ,ở,Ở,ỡ,Ỡ,ứ,Ứ,ừ,Ừ,ự,Ự,ử,Ử,ữ,Ữ,ớ,Ớ,ờ,Ờ,ợ,Ợ,ở,Ở,ỡ,Ỡ".split(
      ",",
    );
  private trangs1: string[] =
    "a,A,â,Â,á,Á,à,À,ạ,Ạ,ả,Ả,ã,Ã,ấ,Ấ,ầ,Ầ,ậ,Ậ,ẩ,Ẩ,ẫ,Ẫ".split(",");
  private trangb1: string[] =
    "ă,Ă,ă,Ă,ắ,Ắ,ằ,Ằ,ặ,Ặ,ẳ,Ẳ,ẵ,Ẵ,ắ,Ắ,ằ,Ằ,ặ,Ặ,ẳ,Ẳ,ẵ,Ẵ".split(",");
  private as1: string[] =
    "a,A,ă,Ă,á,Á,à,À,ạ,Ạ,ả,Ả,ã,Ã,ắ,Ắ,ằ,Ằ,ặ,Ặ,ẳ,Ẳ,ẵ,Ẵ,ế,Ế,ề,Ề,ệ,Ệ,ể,Ể,ễ,Ễ".split(
      ",",
    );
  private ab1: string[] =
    "â,Â,â,Â,ấ,Ấ,ầ,Ầ,ậ,Ậ,ẩ,Ẩ,ẫ,Ẫ,ấ,Ấ,ầ,Ầ,ậ,Ậ,ẩ,Ẩ,ẫ,Ẫ,é,É,è,È,ẹ,Ẹ,ẻ,Ẻ,ẽ,Ẽ".split(
      ",",
    );
  private es1: string[] = "e,E,é,É,è,È,ẹ,Ẹ,ẻ,Ẻ,ẽ,Ẽ".split(",");
  private eb1: string[] = "ê,Ê,ế,Ế,ề,Ề,ệ,Ệ,ể,Ể,ễ,Ễ".split(",");
  private english: string = "ĐÂĂƠƯÊÔ";
  private lowen: string = "đâăơưêô";
  private arA: string[] = "á,à,ả,ã,ạ,a,Á,À,Ả,Ã,Ạ,A".split(",");
  private mocrA: string[] =
    "ó,ò,ỏ,õ,ọ,o,ú,ù,ủ,ũ,ụ,u,Ó,Ò,Ỏ,Õ,Ọ,O,Ú,Ù,Ủ,Ũ,Ụ,U".split(",");
  private erA: string[] = "é,è,ẻ,ẽ,ẹ,e,É,È,Ẻ,Ẽ,Ẹ,E".split(",");
  private orA: string[] = "ó,ò,ỏ,õ,ọ,o,Ó,Ò,Ỏ,Õ,Ọ,O".split(",");
  private aA: string[] = "ấ,ầ,ẩ,ẫ,ậ,â,Ấ,Ầ,Ẩ,Ẫ,Ậ,Â".split(",");
  private oA: string[] = "ố,ồ,ổ,ỗ,ộ,ô,Ố,Ồ,Ổ,Ỗ,Ộ,Ô".split(",");
  private mocA: string[] =
    "ớ,ờ,ở,ỡ,ợ,ơ,ứ,ừ,ử,ữ,ự,ư,Ớ,Ờ,Ở,Ỡ,Ợ,Ơ,Ứ,Ừ,Ử,Ữ,Ự,Ư".split(",");
  private trangA: string[] = "ắ,ằ,ẳ,ẵ,ặ,ă,Ắ,Ằ,Ẳ,Ẵ,Ặ,Ă".split(",");
  private eA: string[] = "ế,ề,ể,ễ,ệ,ê,Ế,Ề,Ể,Ễ,Ệ,Ê".split(",");
  private skey2: string[] =
    "a,a,a,e,e,i,o,o,o,u,u,y,A,A,A,E,E,I,O,O,O,U,U,Y".split(",");

  // Method specific keys (configured per input method in setupForMethod)
  private DAWEO: string = "";
  private SFJRX: string = "";
  private S: string = "";
  private F: string = "";
  private J: string = "";
  private R: string = "";
  private X: string = "";
  private Z: string = "";
  private D: string = "";
  private moc: string = "";
  private trang: string = "";
  private A: string = "";
  private E: string = "";
  private O: string = "";
  private tw5: string = "";

  private config: AvimConfig;

  constructor(config?: Partial<AvimConfig>) {
    this.config = {
      method: 1,
      onOff: 1,
      ckSpell: 1,
      oldAccent: 0,
      ...config,
    };
  }

  // =====================
  // Low-level helpers
  // =====================
  private fcc(x: number): string {
    return String.fromCharCode(x);
  }
  private up(w: string): string {
    return w.toUpperCase();
  }
  private nan(w: any): boolean {
    return isNaN(w) || w == "e";
  }

  private getSF(): string[] {
    const sf: string[] = [];

    for (let x = 0; x < this.skey.length; x++)
      sf[sf.length] = this.fcc(this.skey[x]);

    return sf;
  }

  /**
   * Return Unicode code points for tone-mark substitutions given a tone key.
   * Mirrors AVIM tables for S/F/J/R/X.
   */
  private retKC(k: string): number[] {
    if (k == this.S)
      return [
        225, 7845, 7855, 233, 7871, 237, 243, 7889, 7899, 250, 7913, 253, 193,
        7844, 7854, 201, 7870, 205, 211, 7888, 7898, 218, 7912, 221,
      ];
    if (k == this.F)
      return [
        224, 7847, 7857, 232, 7873, 236, 242, 7891, 7901, 249, 7915, 7923, 192,
        7846, 7856, 200, 7872, 204, 210, 7890, 7900, 217, 7914, 7922,
      ];
    if (k == this.J)
      return [
        7841, 7853, 7863, 7865, 7879, 7883, 7885, 7897, 7907, 7909, 7921, 7925,
        7840, 7852, 7862, 7864, 7878, 7882, 7884, 7896, 7906, 7908, 7920, 7924,
      ];
    if (k == this.R)
      return [
        7843, 7849, 7859, 7867, 7875, 7881, 7887, 7893, 7903, 7911, 7917, 7927,
        7842, 7848, 7858, 7866, 7874, 7880, 7886, 7892, 7902, 7910, 7916, 7926,
      ];
    if (k == this.X)
      return [
        227, 7851, 7861, 7869, 7877, 297, 245, 7895, 7905, 361, 7919, 7929, 195,
        7850, 7860, 7868, 7876, 296, 213, 7894, 7904, 360, 7918, 7928,
      ];

    return [];
  }

  /**
   * Build the set of all code points that represent any tone marks excluding
   * the current one (when provided). Used for stripping tones.
   */
  private repSign(k: string | null): number[] {
    const u: number[] = [];

    for (let a = 0; a < 5; a++) {
      if (k == null || this.SFJRX.slice(a, a + 1) != this.up(k)) {
        const temp = this.retKC(this.SFJRX.slice(a, a + 1));

        for (let b = 0; b < temp.length; b++) u[u.length] = temp[b];
      }
    }

    return u;
  }

  /**
   * Remove tone marks from a word, mapping marked characters back to base.
   */
  private unV(w: string): string {
    const u = this.repSign(null);

    for (let a = 1; a <= w.length; a++) {
      for (let b = 0; b < u.length; b++) {
        if (u[b] == w.charCodeAt(w.length - a)) {
          w =
            w.slice(0, w.length - a) +
            this.fcc(this.skey[b % 24]) +
            w.slice(w.length - a + 1);
        }
      }
    }

    return w;
  }

  /**
   * Convert Vietnamese base characters to ASCII-like placeholders per AVIM.
   */
  private unV2(w: string): string {
    for (let a = 1; a <= w.length; a++) {
      for (let b = 0; b < this.skey.length; b++) {
        if (this.skey[b] == w.charCodeAt(w.length - a)) {
          w =
            w.slice(0, w.length - a) +
            this.skey2[b] +
            w.slice(w.length - a + 1);
        }
      }
    }

    return w;
  }

  /**
   * Map DAWEO (A/E/O + horn/mark) combinations for VIQR/VNI paths.
   */
  private DAWEOF(cc: string, k: string, g: number): number[] | false {
    const ret: any[] = [g];
    const kA = [this.A, this.moc, this.trang, this.E, this.O];
    const ccA = [this.aA, this.mocA, this.trangA, this.eA, this.oA];
    const ccrA = [this.arA, this.mocrA, this.arA, this.erA, this.orA];

    for (let a = 0; a < kA.length; a++) {
      if (k == kA[a]) {
        for (let z = 0; z < ccA[a].length; z++) {
          if (cc == ccA[a][z]) ret[1] = ccrA[a][z];
        }
      }
    }
    if (ret[1]) return ret as number[];

    return false;
  }

  /**
   * Spell checker hook (disabled, preserved for compatibility).
   */
  private ckspell(_w: string, _k: string): boolean {
    return false;
  }

  /**
   * Core locator: determine position in word to apply transformation for key k
   * given the method-specific vowel set sf.
   */
  private findC(
    w: string,
    k: string,
    sf: string[],
  ): number | (number | string)[] | false {
    const method = this.config.method;

    if ((method == 3 || method == 4) && w.slice(w.length - 1, w.length) == "\\")
      return [1, k.charCodeAt(0)];

    let str = "";
    let res: any;
    let cc = "";
    let pc = "";
    let tE = "";
    const vowA: number[] = [];
    const s = "ÂĂÊÔƠƯêâăơôư";
    let c = 0;
    let dn = false;
    const uw = this.up(w);
    let tv: number;
    let g: number;
    const DAWEOFA = this.up(
      this.aA.join() +
        this.eA.join() +
        this.mocA.join() +
        this.trangA.join() +
        this.oA.join() +
        this.english,
    );
    let h: number;
    let uc: string;

    for (g = 0; g < sf.length; g++) {
      if (this.nan(sf[g])) str += sf[g];
      else str += this.fcc(sf[g] as any);
    }

    const uk = this.up(k);
    const w2 = this.up(this.unV2(this.unV(w)));
    const dont = "ƯA,ƯU".split(",");

    if (this.DAWEO.indexOf(uk) >= 0) {
      if (uk == this.moc) {
        if (w2.indexOf("UU") >= 0 && this.tw5 != dont[1]) {
          if (w2.indexOf("UU") == w.length - 2) res = 2;
          else return false;
        } else if (w2.indexOf("UOU") >= 0) {
          if (w2.indexOf("UOU") == w.length - 3) res = 2;
          else return false;
        }
      }

      if (!res) {
        for (g = 1; g <= w.length; g++) {
          cc = w.slice(w.length - g, w.length - g + 1);
          pc = this.up(w.slice(w.length - g - 1, w.length - g));
          uc = this.up(cc);

          for (h = 0; h < dont.length; h++) {
            if (this.tw5 == dont[h] && this.tw5 == this.unV(pc + uc)) dn = true;
          }
          if (dn) {
            dn = false;
            continue;
          }

          if (str.indexOf(uc) >= 0) {
            if (
              (uk == this.moc &&
                this.unV(uc) == "U" &&
                this.up(
                  this.unV(w.slice(w.length - g + 1, w.length - g + 2)),
                ) == "A") ||
              (uk == this.trang && this.unV(uc) == "A" && this.unV(pc) == "U")
            ) {
              if (this.unV(uc) == "U") tv = 1;
              else tv = 2;
              const ccc = this.up(
                w.slice(w.length - g - tv, w.length - g - tv + 1),
              );

              if (ccc != "Q") res = g + tv - 1;
              else if (uk == this.trang) res = g;
              else if (this.moc != this.trang) return false;
            } else {
              res = g;
            }
            if (!this.whit || uw.indexOf("Ư") < 0 || uw.indexOf("W") < 0) break;
          } else if (DAWEOFA.indexOf(uc) >= 0) {
            if (uk == this.D) {
              if (cc == "đ") res = [g, "d"];
              else if (cc == "Đ") res = [g, "D"];
            } else {
              res = this.DAWEOF(cc, uk, g);
            }
            if (res) break;
          }
        }
      }
    }

    if (uk != this.Z && this.DAWEO.indexOf(uk) < 0) {
      const tEC = this.retKC(uk);

      for (g = 0; g < tEC.length; g++) tE += this.fcc(tEC[g]);
    }

    for (g = 1; g <= w.length; g++) {
      if (this.DAWEO.indexOf(uk) < 0) {
        cc = this.up(w.slice(w.length - g, w.length - g + 1));
        pc = this.up(w.slice(w.length - g - 1, w.length - g));
        if (str.indexOf(cc) >= 0) {
          if (cc == "U") {
            if (pc != "Q") {
              c++;
              vowA[vowA.length] = g;
            }
          } else if (cc == "I") {
            if (pc != "G" || c <= 0) {
              c++;
              vowA[vowA.length] = g;
            }
          } else {
            c++;
            vowA[vowA.length] = g;
          }
        } else if (uk != this.Z) {
          const signs = this.repSign(k);

          for (h = 0; h < signs.length; h++) {
            if (signs[h] == w.charCodeAt(w.length - g)) {
              if (this.ckspell(w, k)) return false;

              return [g, this.retKC(uk)[h % 24]];
            }
          }
          for (h = 0; h < this.retKC(uk).length; h++) {
            if (this.retKC(uk)[h] == w.charCodeAt(w.length - g))
              return [g, this.fcc(this.skey[h])];
          }
        }
      }
    }

    if (uk != this.Z && typeof res != "object") {
      if (this.ckspell(w, k)) return false;
    }

    if (this.DAWEO.indexOf(uk) < 0) {
      for (g = 1; g <= w.length; g++) {
        if (
          uk != this.Z &&
          s.indexOf(w.slice(w.length - g, w.length - g + 1)) >= 0
        )
          return g;
        else if (tE.indexOf(w.slice(w.length - g, w.length - g + 1)) >= 0) {
          for (h = 0; h < this.retKC(uk).length; h++) {
            if (
              w.slice(w.length - g, w.length - g + 1).charCodeAt(0) ==
              this.retKC(uk)[h]
            )
              return [g, this.fcc(this.skey[h])];
          }
        }
      }
    }

    if (res) return res;

    if (c == 1 || uk == this.Z) return vowA[0];
    else if (c == 2) {
      let v = 2;

      if (w.slice(w.length - 1) == " ") v = 3;
      const ttt = this.up(w.slice(w.length - v, w.length));

      if (
        this.config.oldAccent == 0 &&
        (ttt == "UY" || ttt == "OA" || ttt == "OE")
      )
        return vowA[0];

      let c2 = 0;
      let fdconsonant: boolean;
      const sc = "BCD" + this.fcc(272) + "GHKLMNPQRSTVX";
      const dc = "CH,GI,KH,NGH,GH,NG,NH,PH,QU,TH,TR".split(",");

      for (h = 1; h <= w.length; h++) {
        fdconsonant = false;
        for (g = 0; g < dc.length; g++) {
          if (
            this.up(
              w.slice(w.length - h - dc[g].length + 1, w.length - h + 1),
            ).indexOf(dc[g]) >= 0
          ) {
            c2++;
            fdconsonant = true;
            if (dc[g] != "NGH") h++;
            else h += 2;
          }
        }
        if (!fdconsonant) {
          if (sc.indexOf(this.up(w.slice(w.length - h, w.length - h + 1))) >= 0)
            c2++;
          else break;
        }
      }

      if (c2 == 1 || c2 == 2) return vowA[0];
      else return vowA[1];
    } else if (c == 3) return vowA[1];
    else return false;
  }

  /**
   * Transform character at located position according to mapping tables.
   */
  private tr(k: string, w: string, by: any[], sf: any[]): string {
    const pos = this.findC(w, k, sf);

    if (pos) {
      if (Array.isArray(pos) && pos[1]) {
        const p0 = pos[0] as number;
        const repl =
          typeof pos[1] === "number"
            ? this.fcc(pos[1] as number)
            : (pos[1] as string);

        return w.slice(0, w.length - p0) + repl + w.slice(w.length - p0 + 1);
      } else {
        const pC = w.slice(
          w.length - (pos as number),
          w.length - (pos as number) + 1,
        );
        const r = sf;

        for (let g = 0; g < r.length; g++) {
          let cmp: any;

          if (this.nan(r[g]) || r[g] == "e") cmp = pC;
          else cmp = pC.charCodeAt(0);
          if (cmp == r[g]) {
            let c: any;

            if (!this.nan(by[g])) c = by[g];
            else c = by[g].charCodeAt(0);

            return (
              w.slice(0, w.length - (pos as number)) +
              this.fcc(c) +
              w.slice(w.length - (pos as number) + 1)
            );
          }
        }
      }
    }

    return w;
  }

  /**
   * Return Unicode code point to replace character at pos with tone k.
   */
  private retUni(w: string, k: string, pos: number): number {
    const u = this.retKC(this.up(k));
    let uC = 0,
      lC = 0;
    const c = w.charCodeAt(w.length - pos);
    const t = this.fcc(c);

    for (let a = 0; a < this.skey.length; a++) {
      if (this.skey[a] == c) {
        if (a < 12) {
          lC = a;
          uC = a + 12;
        } else {
          lC = a - 12;
          uC = a;
        }
        if (t != this.up(t)) return u[lC];

        return u[uC];
      }
    }

    return c;
  }

  /**
   * Single replacement: apply tone or diacritic for one letter.
   */
  private sr(w: string, k: string): string {
    const sf = this.getSF();
    const pos = this.findC(w, k, sf);

    if (pos) {
      if (Array.isArray(pos) && pos[1]) {
        const p0 = pos[0] as number;
        const repl =
          typeof pos[1] === "number"
            ? this.fcc(pos[1] as number)
            : (pos[1] as string);

        return w.slice(0, w.length - p0) + repl + w.slice(w.length - p0 + 1);
      } else {
        const c = this.retUni(w, k, pos as number);

        return (
          w.slice(0, w.length - (pos as number)) +
          this.fcc(c) +
          w.slice(w.length - (pos as number) + 1)
        );
      }
    }

    return w;
  }

  /**
   * Configure method-specific keys and markers for TELEX/VNI/VIQR variants.
   */
  private setupForMethod(a: string[]): void {
    const method = this.config.method;

    if (method == 2 || (method == 0 && a[0] == "9")) {
      this.DAWEO = "6789";
      this.SFJRX = "12534";
      this.S = "1";
      this.F = "2";
      this.J = "5";
      this.R = "3";
      this.X = "4";
      this.Z = "0";
      this.D = "9";
      this.moc = "7";
      this.trang = "8";
      this.A = "^";
      this.E = "^";
      this.O = "^";
    } else if (method == 3 || (method == 0 && a[4] == "+")) {
      this.DAWEO = "^+(D";
      this.SFJRX = "'`.?~";
      this.S = "'";
      this.F = "`";
      this.J = ".";
      this.R = "?";
      this.X = "~";
      this.Z = "-";
      this.D = "D";
      this.moc = "+";
      this.trang = "(";
      this.A = "^";
      this.E = "^";
      this.O = "^";
    } else if (method == 4 || (method == 0 && a[4] == "*")) {
      this.DAWEO = "^*(D";
      this.SFJRX = "'`.?~";
      this.S = "'";
      this.F = "`";
      this.J = ".";
      this.R = "?";
      this.X = "~";
      this.Z = "-";
      this.D = "D";
      this.moc = "*";
      this.trang = "(";
      this.A = "^";
      this.E = "^";
      this.O = "^";
    } else {
      this.SFJRX = "SFJRX";
      this.DAWEO = "DAWEO";
      this.D = "D";
      this.S = "S";
      this.F = "F";
      this.J = "J";
      this.R = "R";
      this.X = "X";
      this.Z = "Z";
      this.trang = "W";
      this.moc = "W";
      this.A = "A";
      this.E = "E";
      this.O = "O";
    }
  }

  /**
   * Main AVIM transformation for a prefix w and typed key k under mapping a.
   */
  private main(w: string, k: string, a: string[]): string {
    const uk = this.up(k);
    const bya = [
      this.db1,
      this.ab1,
      this.eb1,
      this.ob1,
      this.mocb1,
      this.trangb1,
    ];
    const t = "d,D,a,A,a,A,o,O,u,U,e,E,o,O".split(",");
    const sfa = [
      this.ds1,
      this.as1,
      this.es1,
      this.os1,
      this.mocs1,
      this.trangs1,
    ];
    let by: any[] = [];
    let sf: any[] = [];

    this.setupForMethod(a);

    let got = false;

    if (this.SFJRX.indexOf(uk) >= 0) {
      const ret = this.sr(w, k);

      got = true;
      if (ret !== w) return ret;
    } else if (uk == this.Z) {
      sf = this.repSign(null);
      for (let h = 0; h < this.english.length; h++) {
        sf[sf.length] = this.lowen.charCodeAt(h);
        sf[sf.length] = this.english.charCodeAt(h);
      }
      for (let h = 0; h < 5; h++) {
        for (let g = 0; g < this.skey.length; g++) {
          by[by.length] = this.skey[g];
        }
      }
      for (let h = 0; h < t.length; h++) by[by.length] = t[h];
      got = true;
    } else {
      for (let h = 0; h < a.length; h++) {
        if (a[h] == uk) {
          got = true;
          by = by.concat(bya[h]);
          sf = sf.concat(sfa[h]);
        }
      }
    }

    if (uk == this.moc) this.whit = true;
    if (!got) return w;
    if (this.DAWEO.indexOf(uk) >= 0 || this.Z.indexOf(uk) >= 0)
      return this.tr(k, w, by, sf);

    return w;
  }

  /** Utility: does word contain any character from set? */
  private hasCharFromSet(word: string, set: string[]): boolean {
    for (const ch of set) {
      if (word.indexOf(ch) >= 0) return true;
    }

    return false;
  }

  /** Utility: does word contain any tone mark? */
  private hasTone(word: string): boolean {
    const all = [
      ...this.retKC("S"),
      ...this.retKC("F"),
      ...this.retKC("R"),
      ...this.retKC("X"),
      ...this.retKC("J"),
    ];

    for (const code of all) {
      if (word.indexOf(this.fcc(code)) >= 0) return true;
    }

    return false;
  }

  /** Map an A/E/O/W/D key to its diacritic character set for toggle detection. */
  private diacriticSetForKey(keyUpper: string): string[] | null {
    if (keyUpper === "E") return this.eb1;
    if (keyUpper === "A") return this.ab1;
    if (keyUpper === "O") return this.ob1;
    if (keyUpper === "W") return this.mocb1.concat(this.trangb1);
    if (keyUpper === "D") return ["đ", "Đ"];

    return null;
  }

  // =====================
  // Public API - word/keystroke processing
  // =====================
  /** Process a full word by simulating keystrokes for each character. */
  processWord(word: string): string {
    if (!word || word.length === 0) return word;
    if (this.config.onOff === 0) return word;

    const telex = "D,A,E,O,W,W".split(",");
    const vni = "9,6,6,6,7,8".split(",");
    const viqr = "D,^,^,^,+,(".split(",");
    const viqr2 = "D,^,^,^,*,(".split(",");

    let uni: string[] = [];
    let uni2: string[] = [];
    let uni3: string[] = [];
    let uni4: string[] = [];

    if (this.config.method == 0) {
      // AUTO
      const arr: string[][] = [];
      const check = [true, true, true, true];
      const value1 = [telex, vni, viqr, viqr2];

      for (let a = 0; a < check.length; a++) {
        if (check[a]) arr[arr.length] = value1[a];
      }
      for (let a = 0; a < arr.length; a++) {
        if (a === 0) uni = arr[a];
        if (a === 1) uni2 = arr[a];
        if (a === 2) uni3 = arr[a];
        if (a === 3) uni4 = arr[a];
      }
      if (!uni.length) return word;
    } else if (this.config.method == 1) {
      uni = telex;
    } else if (this.config.method == 2) {
      uni = vni;
    } else if (this.config.method == 3) {
      uni = viqr;
    } else if (this.config.method == 4) {
      uni = viqr2;
    }

    let currentWord = word;

    for (let i = 1; i <= currentWord.length; i++) {
      const w = currentWord.substring(0, i);
      const k = currentWord.substring(i - 1, i);
      let processed = this.main(w, k, uni);

      if (processed !== w) {
        currentWord = processed + currentWord.substring(i);
        continue;
      }
      if (this.config.method === 0) {
        if (uni2.length) {
          processed = this.main(w, k, uni2);
          if (processed !== w) {
            currentWord = processed + currentWord.substring(i);
            continue;
          }
        }
        if (uni3.length) {
          processed = this.main(w, k, uni3);
          if (processed !== w) {
            currentWord = processed + currentWord.substring(i);
            continue;
          }
        }
        if (uni4.length) {
          processed = this.main(w, k, uni4);
          if (processed !== w) {
            currentWord = processed + currentWord.substring(i);
            continue;
          }
        }
      }
    }

    return currentWord;
  }

  /**
   * Process a single keystroke applied to the current prefix (closer to AVIM's
   * real-time behavior). This method also implements two ergonomic
   * improvements:
   * - Incremental uo + w => ươ composition preserving case.
   * - Long-distance horn composition when uo is followed by consonants.
   *
   * These improvements are designed to be backward compatible with AVIM.
   */
  processWithKey(prefix: string, key: string): string {
    if (this.config.onOff === 0) return prefix + key;
    const telex = "D,A,E,O,W,W".split(",");
    const vni = "9,6,6,6,7,8".split(",");
    const viqr = "D,^,^,^,+,(".split(",");
    const viqr2 = "D,^,^,^,*,(".split(",");

    let uni: string[] = [];
    let uni2: string[] = [];
    let uni3: string[] = [];
    let uni4: string[] = [];

    if (this.config.method == 0) {
      // AUTO
      const arr: string[][] = [];
      const value1 = [telex, vni, viqr, viqr2];

      for (let a = 0; a < value1.length; a++) arr[arr.length] = value1[a];
      for (let a = 0; a < arr.length; a++) {
        if (a === 0) uni = arr[a];
        if (a === 1) uni2 = arr[a];
        if (a === 2) uni3 = arr[a];
        if (a === 3) uni4 = arr[a];
      }
    } else if (this.config.method == 1) {
      uni = telex;
    } else if (this.config.method == 2) {
      uni = vni;
    } else if (this.config.method == 3) {
      uni = viqr;
    } else if (this.config.method == 4) {
      uni = viqr2;
    }

    // Special incremental composition: uo + w/uow -> ươ (preserve case)
    if (this.config.method === 1 || this.config.method === 0) {
      const last2 = prefix.slice(-2);

      if (/uo/i.test(last2) && key.toLowerCase() === "w") {
        const u = last2[0];
        const o = last2[1];
        const isUpperU = u === u.toUpperCase();
        const isUpperO = o === o.toUpperCase();
        const composed = (isUpperU ? "Ư" : "ư") + (isUpperO ? "Ơ" : "ơ");

        return prefix.slice(0, -2) + composed;
      }
    }

    // Long-distance horn composition: if key is 'w' and word ends with consonants after 'uo', map to 'ươ'
    if (
      (this.config.method === 1 || this.config.method === 0) &&
      key.toLowerCase() === "w"
    ) {
      // Define a simple Vietnamese vowel class
      const vowelClass = /[aeiouyâăêôơưAEIOUYÂĂÊÔƠƯ]/;

      // Find last 'uo' before trailing consonants
      for (let i = prefix.length - 2; i >= 1; i--) {
        if (
          prefix[i - 1].toLowerCase() === "u" &&
          prefix[i].toLowerCase() === "o"
        ) {
          // Ensure from i+1 to end there are no vowels (only consonants), so 'uo' is the last vowel cluster
          let hasVowelAfter = false;

          for (let j = i + 1; j < prefix.length; j++) {
            if (vowelClass.test(prefix[j])) {
              hasVowelAfter = true;
              break;
            }
          }
          if (!hasVowelAfter) {
            const U = prefix[i - 1];
            const O = prefix[i];
            const isUUpper = U === U.toUpperCase();
            const isOUpper = O === O.toUpperCase();
            const composed = (isUUpper ? "Ư" : "ư") + (isOUpper ? "Ơ" : "ơ");

            return (
              prefix.substring(0, i - 1) + composed + prefix.substring(i + 1)
            );
          }
        }
      }
    }

    // Call main with prefix (text before key), as in AVIM
    const before = prefix;
    let out = this.main(prefix, key, uni);

    if (out !== before) {
      const keyUpper = key.toUpperCase();

      // Tone toggle-off: previously had tone, now removed -> append key (preserve case)
      if ("SFJRX".indexOf(keyUpper) >= 0) {
        if (this.hasTone(before) && !this.hasTone(out)) return out + key;

        return out;
      }
      // Diacritic toggle-off: previously had respective diacritic, now removed -> append key (preserve case)
      const set = this.diacriticSetForKey(keyUpper);

      if (set) {
        if (this.hasCharFromSet(before, set) && !this.hasCharFromSet(out, set))
          return out + key;

        return out;
      }

      return out;
    }
    if (this.config.method === 0) {
      if (uni2.length) {
        out = this.main(prefix, key, uni2);
        if (out !== before) {
          const keyUpper = key.toUpperCase();

          if ("SFJRX".indexOf(keyUpper) >= 0) {
            if (this.hasTone(before) && !this.hasTone(out)) return out + key;

            return out;
          }
          const set = this.diacriticSetForKey(keyUpper);

          if (set) {
            if (
              this.hasCharFromSet(before, set) &&
              !this.hasCharFromSet(out, set)
            )
              return out + key;

            return out;
          }

          return out;
        }
      }
      if (uni3.length) {
        out = this.main(prefix, key, uni3);
        if (out !== before) {
          const keyUpper = key.toUpperCase();

          if ("SFJRX".indexOf(keyUpper) >= 0) {
            if (this.hasTone(before) && !this.hasTone(out)) return out + key;

            return out;
          }
          const set = this.diacriticSetForKey(keyUpper);

          if (set) {
            if (
              this.hasCharFromSet(before, set) &&
              !this.hasCharFromSet(out, set)
            )
              return out + key;

            return out;
          }

          return out;
        }
      }
      if (uni4.length) {
        out = this.main(prefix, key, uni4);
        if (out !== before) {
          const keyUpper = key.toUpperCase();

          if ("SFJRX".indexOf(keyUpper) >= 0) {
            if (this.hasTone(before) && !this.hasTone(out)) return out + key;

            return out;
          }
          const set = this.diacriticSetForKey(keyUpper);

          if (set) {
            if (
              this.hasCharFromSet(before, set) &&
              !this.hasCharFromSet(out, set)
            )
              return out + key;

            return out;
          }

          return out;
        }
      }
    }
    // If no change, decide whether to append key literally
    const keyUpper = key.toUpperCase();
    const diacriticSet = this.diacriticSetForKey(keyUpper);

    if (diacriticSet) {
      // appending diacritic when no transformation should just add the literal letter (preserve case)
      return prefix + key;
    }
    // tone markers that didn't transform should append literally (preserve case)
    if ("SFJRX".indexOf(keyUpper) >= 0) return prefix + key;

    return prefix + key;
  }

  // API
  setMethod(method: number): void {
    this.config.method = method;
    this.config.onOff = method === -1 ? 0 : 1;
  }
  setMethodByString(method: VietnameseInputMethod): void {
    const methodMap: Record<VietnameseInputMethod, number> = {
      OFF: -1,
      AUTO: 0,
      TELEX: 1,
      VNI: 2,
      VIQR: 3,
      "VIQR*": 4,
    };

    this.setMethod(methodMap[method] ?? 1);
  }
  setEnabled(enabled: boolean): void {
    this.config.onOff = enabled ? 1 : 0;
  }
  getMethod(): number {
    return this.config.method;
  }
  getMethodString(): VietnameseInputMethod {
    const map: Record<number, VietnameseInputMethod> = {
      [-1]: "OFF",
      [0]: "AUTO",
      [1]: "TELEX",
      [2]: "VNI",
      [3]: "VIQR",
      [4]: "VIQR*",
    };

    return map[this.config.method] ?? "TELEX";
  }
  isEnabled(): boolean {
    return this.config.onOff === 1;
  }
}

export default function anvim(input: string): string {
  const engine = new AnvimEngine();
  let out = "";

  for (let i = 0; i < input.length; i++) {
    out = engine.processWithKey(out, input[i]);
  }

  return out;
}

export const anvimEngine = new AnvimEngine();
