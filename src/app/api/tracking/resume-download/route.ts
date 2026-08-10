import { z } from "zod";
import { isTrackingSameOrigin } from "@/lib/tracking/request-validation";
import { recordResumeDownload } from "@/lib/tracking/service";

const resumeDownloadSchema = z.object({
  sessionId: z.string().uuid(),
  pathname: z.string().regex(/^\/[a-zA-Z0-9/_-]*$/).max(160),
});

export async function POST(request: Request) {
  if (!isTrackingSameOrigin(request)) return new Response(null, { status: 403 });
  try {
    const input = resumeDownloadSchema.safeParse(await request.json());
    if (input.success && !input.data.pathname.startsWith("/tracking")) {
      recordResumeDownload(request, input.data);
    }
  } catch {
    // Tracking is write-only and cannot alter the PDF download outcome.
  }
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
