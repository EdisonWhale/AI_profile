"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  clearLoginFailures,
  createTrackingAdminSession,
  destroyTrackingAdminSession,
  isLoginRateLimited,
  recordLoginFailure,
  verifyTrackingPassword,
} from "@/lib/tracking/auth";
import { getTrustedClientIp } from "@/lib/tracking/client-ip";
import { hashIp } from "@/lib/tracking/crypto";

const passwordSchema = z.string().min(1).max(512);

async function loginKey() {
  const requestHeaders = await headers();
  const ip = getTrustedClientIp(new Request("http://localhost", { headers: requestHeaders }));
  try {
    return hashIp(ip);
  } catch {
    return "unconfigured";
  }
}

export async function loginTracking(formData: FormData) {
  const password = passwordSchema.safeParse(formData.get("password"));
  const key = await loginKey();
  if (!password.success || isLoginRateLimited(key)) redirect("/tracking/login?error=1");

  let isValid = false;
  try {
    isValid = await verifyTrackingPassword(password.data);
  } catch {
    isValid = false;
  }
  if (!isValid) {
    recordLoginFailure(key);
    redirect("/tracking/login?error=1");
  }
  clearLoginFailures(key);
  await createTrackingAdminSession();
  redirect("/tracking");
}

export async function logoutTracking() {
  await destroyTrackingAdminSession();
  redirect("/tracking/login");
}
