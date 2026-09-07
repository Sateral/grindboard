import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const PREFIX = "gb1";
const IV_LENGTH = 12;

function deriveKey(secret: string): Buffer {
  return createHash("sha256")
    .update(`grindboard:github-token:${secret}`)
    .digest();
}

function requireSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "BETTER_AUTH_SECRET is required to encrypt GitHub access tokens",
    );
  }
  return secret;
}

/**
 * Encrypts an OAuth access token at rest (AES-256-GCM). The key is derived
 * from the Better Auth secret, so no second secret has to be provisioned.
 */
export function encryptToken(
  value: string,
  secret: string = requireSecret(),
): string {
  const key = deriveKey(secret);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    PREFIX,
    iv.toString("base64url"),
    tag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(":");
}

/** True when the value is already in this module's ciphertext format. */
export function isEncryptedToken(value: string): boolean {
  return value.startsWith(`${PREFIX}:`);
}

/**
 * Decrypts a token produced by {@link encryptToken}. Throws when the value is
 * not valid ciphertext for the configured secret.
 */
export function decryptToken(
  value: string,
  secret: string = requireSecret(),
): string {
  const key = deriveKey(secret);
  const [prefix, ivPart, tagPart, dataPart] = value.split(":");
  if (prefix !== PREFIX || !ivPart || !tagPart || !dataPart) {
    throw new Error("Token is not valid encrypted Grindboard ciphertext");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(ivPart, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(dataPart, "base64url")),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}
