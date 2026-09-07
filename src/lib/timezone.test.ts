import { describe, expect, it } from "vitest";

import { browserTimeZone, isIANATimeZone } from "./timezone";

describe("isIANATimeZone", () => {
  it("accepts real IANA time zones", () => {
    expect(isIANATimeZone("Europe/Berlin")).toBe(true);
    expect(isIANATimeZone("America/Los_Angeles")).toBe(true);
    expect(isIANATimeZone("UTC")).toBe(true);
  });

  it("rejects junk, offsets, and non-strings", () => {
    expect(isIANATimeZone("Berlin")).toBe(false);
    expect(isIANATimeZone("UTC+2")).toBe(false);
    expect(isIANATimeZone("")).toBe(false);
    expect(isIANATimeZone(42)).toBe(false);
    expect(isIANATimeZone(null)).toBe(false);
    expect(isIANATimeZone(undefined)).toBe(false);
  });
});

describe("browserTimeZone", () => {
  it("reports a real IANA time zone in the test environment", () => {
    expect(isIANATimeZone(browserTimeZone())).toBe(true);
  });
});
