import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSessionUser } from "@/lib/auth/session";
import type { SessionRole } from "@/types";

export default async function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionUser();
  const role: SessionRole | null = session?.role ?? null;

  return (
    <>
      <SiteHeader role={role} />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}