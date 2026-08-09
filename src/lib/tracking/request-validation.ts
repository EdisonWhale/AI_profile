import "server-only";

/**
 * Accept browser writes only from this origin. When the configured reverse proxy
 * terminates TLS, its overwritten forwarded host is the authoritative host.
 */
export function isTrackingSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (!origin || (fetchSite && fetchSite !== "same-origin")) return false;
  try {
    const originUrl = new URL(origin);
    if (!/^https?:$/.test(originUrl.protocol) || originUrl.username || originUrl.password) {
      return false;
    }
    const forwardedHost =
      process.env.TRACKING_TRUST_PROXY === "true"
        ? request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
        : null;
    const host = forwardedHost ?? request.headers.get("host");
    if (!host || /[\s/]/.test(host)) return false;
    return originUrl.host.toLocaleLowerCase() === host.toLocaleLowerCase();
  } catch {
    return false;
  }
}
