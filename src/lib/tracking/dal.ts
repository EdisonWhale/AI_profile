import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { isTrackingEnabled } from "./config";
import { verifyTrackingAdmin } from "./auth";
import { getDashboardData, getSessionDetail, type TrackingFilters } from "./repository";

async function requireTrackingAdmin() {
  if (!isTrackingEnabled() || !(await verifyTrackingAdmin())) redirect("/tracking/login");
}

export const getAuthorizedDashboardData = cache(async (filters: TrackingFilters) => {
  await requireTrackingAdmin();
  return getDashboardData(filters);
});

export const getAuthorizedSessionDetail = cache(async (sessionId: string) => {
  await requireTrackingAdmin();
  return getSessionDetail(sessionId);
});
