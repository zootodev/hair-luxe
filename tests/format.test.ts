import { describe, expect, it } from "vitest";
import {
  formatIntlPhone,
  formatNigerianPhone,
  intlPhone,
  phonesMatch,
  swatchColor,
  telHref,
} from "@/lib/format";

describe("intlPhone", () => {
  it("converts Nigerian local numbers to international format", () => {
    expect(intlPhone("0812 345 6789")).toBe("+2348123456789");
    expect(intlPhone("0700123456")).toBe("+234700123456");
  });

  it("normalises bare 234 numbers and keeps + numbers", () => {
    expect(intlPhone("234 812 345 6789")).toBe("+2348123456789");
    expect(intlPhone("+234 812 345 6789")).toBe("+2348123456789");
  });

  it("leaves unrecognisable input unchanged", () => {
    expect(intlPhone("call me")).toBe("call me");
    expect(intlPhone("")).toBe("");
  });
});

describe("telHref", () => {
  it("keeps the + prefix for international numbers", () => {
    expect(telHref("0812 345 6789")).toBe("+2348123456789");
  });

  it("strips formatting from unrecognisable numbers", () => {
    expect(telHref("812-345-6789")).toBe("8123456789");
  });
});

describe("formatIntlPhone", () => {
  it("pretty-prints a 13-digit Nigerian number", () => {
    expect(formatIntlPhone("08123456789")).toBe("+234 812 345 6789");
  });
});

describe("formatNigerianPhone", () => {
  it("normalises an 11-digit local number (leading 0 kept out of the international form)", () => {
    expect(formatNigerianPhone("08123456789")).toBe("+2348123456789");
  });

  it("accepts 234-prefixed and +234 numbers", () => {
    expect(formatNigerianPhone("2348123456789")).toBe("+2348123456789");
    expect(formatNigerianPhone("+2348123456789")).toBe("+2348123456789");
  });

  it("ignores spaces, dashes and brackets", () => {
    expect(formatNigerianPhone("0812 345 6789")).toBe("+2348123456789");
    expect(formatNigerianPhone("+234 (812) 345-6789")).toBe("+2348123456789");
  });

  it("rejects wrong lengths - including the 12-digit typo that loses its leading zero", () => {
    expect(formatNigerianPhone("081234567")).toBeNull(); // too short
    expect(formatNigerianPhone("081234567890")).toBeNull(); // 12 digits
    // The stored-data bug: 070123456789 coerced to a number became
    // "70123456789" - unparseable input must never be silently accepted.
    expect(formatNigerianPhone("70123456789")).toBeNull();
  });

  it("rejects non-Nigerian numbers, letters and empty input", () => {
    expect(formatNigerianPhone("+44 7911 123456")).toBeNull();
    expect(formatNigerianPhone("call me")).toBeNull();
    expect(formatNigerianPhone("")).toBeNull();
  });

  it("displays as +234 XXX XXX XXXX via formatIntlPhone", () => {
    expect(formatIntlPhone(formatNigerianPhone("08123456789") ?? "")).toBe(
      "+234 812 345 6789"
    );
  });
});

describe("phonesMatch", () => {
  it("matches across accepted formats of the same number", () => {
    expect(phonesMatch("08123456789", "+2348123456789")).toBe(true);
    expect(phonesMatch("2348123456789", "0812 345 6789")).toBe(true);
    expect(phonesMatch("+234 812 345 6789", "08123456789")).toBe(true);
  });

  it("does not match different numbers", () => {
    expect(phonesMatch("08123456789", "08031112222")).toBe(false);
  });

  it("falls back to digits for legacy stored numbers that cannot be normalised", () => {
    expect(phonesMatch("+234 701 234 56789", "23470123456789")).toBe(true);
    expect(phonesMatch("70123456789", "070123456789")).toBe(false);
  });
});

describe("swatchColor", () => {
  it("maps known hair colours to hex swatches", () => {
    expect(swatchColor("Natural Black")).toBe("#1f1f1f");
    expect(swatchColor("dark brown")).toBe("#3e2723");
    expect(swatchColor("Honey Blonde")).toBe("#d9b382");
  });

  it("falls back to a neutral tone for unknown names", () => {
    expect(swatchColor("Unicorn Pink")).toBe("#8a7350");
    expect(swatchColor("")).toBe("#8a7350");
  });
});
