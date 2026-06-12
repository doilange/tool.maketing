"use client";

import { DataProvider, useData } from "@/components/content-planner/data-provider";
import { LanguageProvider } from "@/lib/content-planner/i18n";
import { Sidebar } from "@/components/content-planner/sidebar";
import { Topbar } from "@/components/content-planner/topbar";
import { SmartReminderModal } from "@/components/content-planner/smart-reminder-modal";
import { TaskDetailModal } from "@/components/content-planner/task-detail-modal";
import { useRouter, usePathname } from "@/i18n/navigation";
import type { ContentTask } from "@/lib/content-planner/types";
import * as React from "react";

function Inner({ children }: { children: React.ReactNode }) {
  const { loading, me } = useData();
  const router = useRouter();
  const pathname = usePathname();
  const [reviewTask, setReviewTask] = React.useState<ContentTask | null>(null);

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
    <div className="relative min-h-screen flex planner-theme overflow-x-hidden">
      <div className="relative flex w-full min-h-screen z-10">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1 w-full max-w-[1560px] mx-auto p-4 pb-24 sm:p-5 sm:pb-24 lg:p-6 lg:pb-8 relative">
            {children}
          </main>
        </div>
      </div>
      <SmartReminderModal onSelectTask={setReviewTask} />
      <TaskDetailModal
        open={!!reviewTask}
        onOpenChange={(open) => !open && setReviewTask(null)}
        task={reviewTask}
      />
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
