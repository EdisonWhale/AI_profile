"use client";

const STORAGE_KEY = "portfolio_tracking_session_v1";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createSessionId() {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    if (!globalThis.crypto?.getRandomValues) throw new Error("Web Crypto unavailable");
    const values = new Uint8Array(16);
    globalThis.crypto.getRandomValues(values);
    values[6] = (values[6] & 0x0f) | 0x40;
    values[8] = (values[8] & 0x3f) | 0x80;
    return [...values].map((value, index) => `${[4, 6, 8, 10].includes(index) ? "-" : ""}${value.toString(16).padStart(2, "0")}`).join("");
  } catch {
    const random = () => Math.floor(Math.random() * 16).toString(16);
    return `00000000-0000-4000-8000-${Array.from({ length: 12 }, random).join("")}`;
  }
}

export function getTrackingSessionId() {
  if (typeof window === "undefined") return createSessionId();
  try {
    const existing = window.sessionStorage.getItem(STORAGE_KEY);
    if (existing && UUID_PATTERN.test(existing)) return existing;
    const value = createSessionId();
    window.sessionStorage.setItem(STORAGE_KEY, value);
    return value;
  } catch {
    return createSessionId();
  }
}
