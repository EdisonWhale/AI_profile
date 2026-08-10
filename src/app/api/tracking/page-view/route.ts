import { z } from "zod";
import { recordPageView } from "@/lib/tracking/service";
import { isTrackingSameOrigin } from "@/lib/tracking/request-validation";

const pageViewSchema = z.object({
  sessionId: z.string().uuid(),
  pathname: z.string().regex(/^\/[a-zA-Z0-9/_-]*$/).max(160),
  referrerHost: z.string().max(255).nullable(),
  utmSource: z.string().max(100).nullable(),
  utmMedium: z.string().max(100).nullable(),
  utmCampaign: z.string().max(160).nullable(),
});

export async function POST(request: Request) {
  if (!isTrackingSameOrigin(request)) return new Response(null, { status: 403 });
  try {
    const input = pageViewSchema.safeParse(await request.json());
    if (!input.success || input.data.pathname.startsWith("/tracking")) {
      return new Response(null, { status: 204 });
    }
    recordPageView(request, input.data);
  } catch {
    // This endpoint is deliberately write-only and remains silent for tracking failures.
  }
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
