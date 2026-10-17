import { describe, expect, it } from "vitest";
import { formatIntlPhone, intlPhone, swatchColor, telHref } from "@/lib/format";

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
