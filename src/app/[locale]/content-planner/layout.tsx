"use client";

import { DataProvider, useData } from "@/components/content-planner/data-provider";
import { LanguageProvider } from "@/lib/content-planner/i18n";
import { Sidebar } from "@/components/content-planner/sidebar";
import { Topbar } from "@/components/content-planner/topbar";
import { useRouter, usePathname } from "@/i18n/navigation";
import * as React from "react";

function Inner({ children }: { children: React.ReactNode }) {
  const { loading, me } = useData();
  const router = useRouter();
  const pathname = usePathname();

  // next-intl's usePathname returns the path without locale prefix
  const isLoginPage = pathname?.startsWith("/content-planner/login");

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
      <div className="min-h-screen flex items-center justify-center planner-theme">
        <div className="text-sm text-muted-foreground animate-pulse">Loading…</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex planner-theme overflow-hidden select-none">
      {/* Slow-floating background glow backlights */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-violet-400/10 dark:bg-violet-500/5 blur-[80px] pointer-events-none animate-float-slow z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-pink-400/10 dark:bg-pink-500/5 blur-[90px] pointer-events-none animate-float-delayed z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-blue-300/10 dark:bg-blue-600/3 blur-[100px] pointer-events-none animate-pulse-soft z-0" />

      <div className="relative flex w-full min-h-screen z-10">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1500px] w-full mx-auto relative">
            {children}
          </main>
        </div>
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
