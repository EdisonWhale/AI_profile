import "server-only";

import { createHmac, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { TRACKING_COOKIE_NAME, TRACKING_SESSION_MAX_AGE_SECONDS } from "./config";

const scrypt = promisify(scryptCallback);
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILURES = 5;
const attempts = new Map<string, { failures: number; resetAt: number }>();

function sessionSecret() {
  const secret = process.env.TRACKING_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("Tracking session secret is not configured.");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  for (const entry of cookieHeader.split(";")) {
    const [key, ...value] = entry.trim().split("=");
    if (key === name) return value.join("=") || null;
  }
  return null;
}

function parsePasswordHash() {
  const serialized = process.env.TRACKING_PASSWORD_HASH;
  const [salt, derivedKey] = serialized?.split(":") ?? [];
  if (!salt || !derivedKey) throw new Error("Tracking password hash is not configured.");
  const expected = Buffer.from(derivedKey, "base64");
  if (expected.length < 32) throw new Error("Tracking password hash is invalid.");
  return { salt, expected };
}

export async function verifyTrackingPassword(password: string) {
  const { salt, expected } = parsePasswordHash();
  const derived = Buffer.from(
    (await scrypt(password, salt, expected.length)) as Buffer,
  );
  return timingSafeEqual(derived, expected);
}

export function isLoginRateLimited(key: string) {
  const now = Date.now();
  const attempt = attempts.get(key);
  return Boolean(attempt && attempt.resetAt > now && attempt.failures >= LOGIN_MAX_FAILURES);
}

export function recordLoginFailure(key: string) {
  const now = Date.now();
  const attempt = attempts.get(key);
  if (!attempt || attempt.resetAt <= now) {
    if (attempts.size > 10_000) attempts.clear();
    attempts.set(key, { failures: 1, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }
  attempt.failures += 1;
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}

export async function createTrackingAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + TRACKING_SESSION_MAX_AGE_SECONDS;
  const payload = Buffer.from(JSON.stringify({ v: 1, exp: expiresAt })).toString("base64url");
  const token = `${payload}.${sign(payload)}`;
  const cookieStore = await cookies();
  cookieStore.set(TRACKING_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    // A root path is needed so the signed cookie reaches the write-only APIs.
    path: "/",
    maxAge: TRACKING_SESSION_MAX_AGE_SECONDS,
  });
}

export function verifyTrackingToken(token: string | null | undefined) {
  try {
    if (!token) return false;
    const [payload, signature] = token.split(".");
    if (!payload || !signature || token.split(".").length !== 2) return false;
    const expectedSignature = sign(payload);
    if (Buffer.byteLength(signature) !== Buffer.byteLength(expectedSignature)) return false;
    const validSignature = timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
    if (!validSignature) return false;
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number; v?: number };
    return value.v === 1 && typeof value.exp === "number" && value.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function hasValidTrackingAdminRequest(request: Request) {
  return verifyTrackingToken(
    getCookieValue(request.headers.get("cookie"), TRACKING_COOKIE_NAME),
  );
}

export async function verifyTrackingAdmin() {
  const cookieStore = await cookies();
  return verifyTrackingToken(cookieStore.get(TRACKING_COOKIE_NAME)?.value);
}

export async function destroyTrackingAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(TRACKING_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
