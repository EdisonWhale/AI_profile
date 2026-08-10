import "server-only";

import { getTrackingDatabase } from "./db";

type IpinfoLiteResponse = {
  country_code?: string;
  country?: string;
  asn?: string;
  as_name?: string;
  as_domain?: string;
};

export async function enrichSessionFromIpinfo(sessionId: string, ip: string) {
  const token = process.env.IPINFO_LITE_TOKEN;
  if (!token || ip === "unknown") return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);
  try {
    const response = await fetch(
      `https://api.ipinfo.io/lite/${encodeURIComponent(ip)}?token=${encodeURIComponent(token)}`,
      { signal: controller.signal, cache: "no-store" },
    );
    if (!response.ok) return;
    const data = (await response.json()) as IpinfoLiteResponse;
    getTrackingDatabase()
      .prepare(
        `UPDATE tracking_sessions
         SET country_code = ?, country_name = ?, asn = ?, as_name = ?, as_domain = ?,
             attribution_confidence = ?
         WHERE id = ?`,
      )
      .run(
        data.country_code?.slice(0, 8) ?? null,
        data.country?.slice(0, 80) ?? null,
        data.asn?.slice(0, 30) ?? null,
        data.as_name?.slice(0, 160) ?? null,
        data.as_domain?.slice(0, 160) ?? null,
        data.as_name || data.as_domain ? "medium" : "low",
        sessionId,
      );
  } catch {
    // Enrichment is explicitly best-effort. Do not log the IP or request details.
  } finally {
    clearTimeout(timeout);
  }
}
