import { describe, expect, it } from "vitest";

import { decryptToken, encryptToken, isEncryptedToken } from "./token-crypto";

const SECRET = "test-secret-with-enough-entropy";

describe("encryptToken / decryptToken", () => {
  it("round-trips a GitHub access token", () => {
    const token = "gho_plaintext-token-value";
    const encrypted = encryptToken(token, SECRET);

    expect(encrypted).not.toContain(token);
    expect(isEncryptedToken(encrypted)).toBe(true);
    expect(decryptToken(encrypted, SECRET)).toBe(token);
  });

  it("produces unique ciphertext per call (randomized IV)", () => {
    const token = "gho_same-token";
    expect(encryptToken(token, SECRET)).not.toBe(encryptToken(token, SECRET));
  });

  it("fails to decrypt with the wrong secret", () => {
    const encrypted = encryptToken("gho_token", SECRET);
    expect(() => decryptToken(encrypted, "other-secret")).toThrow();
  });

  it("fails to decrypt garbage input", () => {
    expect(() => decryptToken("not-ciphertext", SECRET)).toThrow();
  });
});
