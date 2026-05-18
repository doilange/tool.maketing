"use client";

import { DataProvider, useData } from "@/components/content-planner/data-provider";
import { LanguageProvider } from "@/lib/content-planner/i18n";
import { Sidebar } from "@/components/content-planner/sidebar";
import { Topbar } from "@/components/content-planner/topbar";
import { useRouter } from "next/navigation";
import * as React from "react";

function Inner({ children }: { children: React.ReactNode }) {
  const { loading, me } = useData();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !me) {
      router.push("/content-planner/login");
    }
  }, [loading, me, router]);

  return (
    <div className="min-h-screen flex planner-theme">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1500px] w-full mx-auto">
          {loading ? (
            <div className="text-sm text-slate-500">Loading workspace…</div>
          ) : (
            children
          )}
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
