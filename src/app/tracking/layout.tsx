import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private analytics",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
