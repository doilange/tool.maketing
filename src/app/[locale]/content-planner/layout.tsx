"use client";

import { DataProvider, useData } from "@/components/content-planner/data-provider";
import { LanguageProvider } from "@/lib/content-planner/i18n";
import { Sidebar } from "@/components/content-planner/sidebar";
import { Topbar } from "@/components/content-planner/topbar";
import { useRouter, usePathname } from "next/navigation";
import * as React from "react";

function Inner({ children }: { children: React.ReactNode }) {
  const { loading, me } = useData();
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on the login page
  const isLoginPage = pathname?.replace(/^\/(en|th)/, "").startsWith("/content-planner/login");

  React.useEffect(() => {
    if (!loading && !me && !isLoginPage) {
      router.push("/content-planner/login");
    }
  }, [loading, me, router, isLoginPage]);

  // Login page: render without sidebar/topbar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Still loading auth — show nothing (prevents flash of dashboard content)
  if (loading || !me) {
    return (
      <div className="min-h-screen flex items-center justify-center planner-theme"
        style={{
          background: `
            radial-gradient(1100px 600px at 0% 0%, #e9d5ff 0%, transparent 60%),
            radial-gradient(900px 500px at 100% 0%, #fbcfe8 0%, transparent 55%),
            radial-gradient(900px 500px at 100% 100%, #fed7aa 0%, transparent 55%),
            radial-gradient(700px 400px at 0% 100%, #bfdbfe 0%, transparent 55%),
            linear-gradient(180deg, #fbf7ff 0%, #ffffff 100%)
          `,
        }}
      >
        <div className="text-sm text-slate-400 animate-pulse">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex planner-theme">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1500px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function ContentPlannerLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <DataProvider>
        <Inner>{children}</Inner>
      </DataProvider>
    </LanguageProvider>
  );
}
