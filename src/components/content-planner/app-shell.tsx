"use client";
import { DataProvider, useData } from "@/components/content-planner/data-provider";
import { LanguageProvider } from "@/lib/content-planner/i18n";
import { Sidebar } from "@/components/content-planner/sidebar";
import { Topbar } from "@/components/content-planner/topbar";

function Inner({ children }: { children: React.ReactNode }) {
  const { loading } = useData();
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1500px] w-full mx-auto">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading workspace…</div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <DataProvider>
        <Inner>{children}</Inner>
      </DataProvider>
    </LanguageProvider>
  );
}
