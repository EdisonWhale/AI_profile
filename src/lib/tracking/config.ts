import "server-only";

export const TRACKING_COOKIE_NAME = "tracking_admin_session";
export const TRACKING_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
export const TRACKING_DEFAULT_RETENTION_DAYS = 90;

export function isTrackingEnabled() {
  return process.env.TRACKING_ENABLED === "true";
}

export function getRetentionDays() {
  const parsed = Number.parseInt(
    process.env.TRACKING_RETENTION_DAYS ?? String(TRACKING_DEFAULT_RETENTION_DAYS),
    10,
  );

  return Number.isFinite(parsed) && parsed >= 1 && parsed <= 365
    ? parsed
    : TRACKING_DEFAULT_RETENTION_DAYS;
}

export function getDatabasePath() {
  return process.env.TRACKING_DB_PATH ?? "./data/tracking.db";
}
