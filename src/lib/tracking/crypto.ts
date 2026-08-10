import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey() {
  const rawKey = process.env.TRACKING_ENCRYPTION_KEY;
  if (!rawKey) throw new Error("Tracking encryption is not configured.");
  const key = Buffer.from(rawKey, "base64");
  if (key.length !== 32) throw new Error("Tracking encryption key must be 32 bytes.");
  return key;
}

function getHashKey() {
  const key = process.env.TRACKING_IP_HASH_KEY;
  if (!key || key.length < 32) throw new Error("Tracking IP hash key is not configured.");
  return key;
}

export function hashIp(ip: string) {
  return createHmac("sha256", getHashKey()).update(ip).digest("hex");
}

export function encryptTrackingValue(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString("base64url");
}

export function decryptTrackingValue(payload: string | null) {
  if (!payload) return null;
  try {
    const bytes = Buffer.from(payload, "base64url");
    const iv = bytes.subarray(0, 12);
    const tag = bytes.subarray(12, 28);
    const ciphertext = bytes.subarray(28);
    const decipher = createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

export function maskIp(ip: string | null) {
  if (!ip || ip === "unknown") return "Unknown";
  if (ip.includes(":")) return `${ip.split(":").slice(0, 3).join(":")}::`;
  const parts = ip.split(".");
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.×` : "Unknown";
}
