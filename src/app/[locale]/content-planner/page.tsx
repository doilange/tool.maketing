"use client";
import * as React from "react";
import { Link } from "@/i18n/navigation";
import { useData } from "@/components/content-planner/data-provider";
import { Card, CardContent } from "@/components/content-planner/ui/card";
import { Button } from "@/components/content-planner/ui/button";
import {
  ApprovalBadge,
  ColorTag,
  PostBadge,
  ProgressBadge,
} from "@/components/content-planner/status-badge";
import { TaskDetailModal } from "@/components/content-planner/task-detail-modal";
import { TaskModal } from "@/components/content-planner/task-modal";
import { SmartReminderModal } from "@/components/content-planner/smart-reminder-modal";
import { formatDate, initials } from "@/lib/content-planner/utils";
import { useT, useActivityAction } from "@/lib/content-planner/i18n";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  ListTodo,
  Plus,
  Sparkles,
} from "lucide-react";
import type { ContentTask } from "@/lib/content-planner/types";

export default function DashboardPage() {
  const { tasks, profiles, products, platforms, me, activity } = useData();
  const t = useT();
  const tAction = useActivityAction();
  const [detail, setDetail] = React.useState<ContentTask | null>(null);
  const [showCreate, setShowCreate] = React.useState(false);

  const [sortMode, setSortMode] = React.useState<"due_date" | "smart_priority">("smart_priority");
  const today = new Date().toISOString().slice(0, 10);

  // Smart priority scoring algorithm
  const getPriorityScore = React.useCallback((task: ContentTask) => {
    let score = 0;
    
    // 1. Urgency Score (max 100)
    if (task.scheduled_date) {
      const diffMs = new Date(task.scheduled_date).getTime() - new Date(today).getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) {
        score += 100; // Overdue or today
      } else if (diffDays === 1) {
        score += 75;  // Due tomorrow
      } else if (diffDays <= 3) {
        score += 50;  // Next 3 days
      } else if (diffDays <= 7) {
        score += 25;  // Next 7 days
      } else {
        score += 10;  // Future
      }
    } else {
      score += 10;    // No scheduled date
    }

    // 2. Speed / Type Bonus (max 30) - e.g. images are faster to finish
    const type = task.content_type?.toLowerCase() || "";
    if (["image", "single image", "carousel"].includes(type)) {
      score += 30; // Fast content / photo / quick win
    } else if (["บทความ", "broadcast", "article"].includes(type)) {
      score += 15; // Medium speed
    } else if (["vdo", "video", "reels", "live", "image/vdo"].includes(type)) {
      score += 0;  // Videos take more time
    }

    // 3. Progress Bonus (max 25) - finish almost completed tasks first
    const progress = task.progress_status;
    if (["waiting_comment", "editing"].includes(progress)) {
      score += 25; // Close to finished
    } else if (["filming", "writing_script"].includes(progress)) {
      score += 15; // In progress
    } else {
      score += 0;  // Not started
    }

    return score;
  }, [today]);

  const upcoming = React.useMemo(() => {
    const unposted = tasks.filter((t) => t.post_status !== "posted");
    if (sortMode === "smart_priority") {
      return [...unposted]
        .map(t => ({ task: t, score: getPriorityScore(t) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
    } else {
      return [...unposted]
        .filter(t => t.scheduled_date && t.scheduled_date >= today)
        .sort((a, b) => (a.scheduled_date ?? "").localeCompare(b.scheduled_date ?? ""))
        .map(t => ({ task: t, score: getPriorityScore(t) }))
        .slice(0, 6);
    }
  }, [tasks, sortMode, today, getPriorityScore]);

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) =>
      ["thinking_topic", "writing_script", "filming", "editing", "waiting_comment"].includes(t.progress_status)
    ).length,
    posted: tasks.filter((t) => t.post_status === "posted").length,
    pending: tasks.filter((t) => t.approval_status === "pending").length,
  };

  function getPriorityBadge(score: number) {
    if (score >= 130) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-rose-500/10 text-rose-500 ring-1 ring-inset ring-rose-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)] animate-pulse-soft select-none whitespace-nowrap">
          <span className="h-1 w-1 rounded-full bg-rose-500 animate-ping" />
          {t("priority.critical")}
        </span>
      );
    }
    if (score >= 100) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-500 ring-1 ring-inset ring-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.15)] select-none whitespace-nowrap">
          {t("priority.quick_urgent")}
        </span>
      );
    }
    if (score >= 70) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20 select-none whitespace-nowrap">
          {t("priority.quick_win")}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-white/20 dark:bg-white/5 text-muted-foreground ring-1 ring-inset ring-white/10 select-none whitespace-nowrap">
        {t("priority.scheduled")}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-brand-gradient flex items-center gap-2 select-none">
            <Sparkles className="h-6 w-6 text-violet-500 dark:text-violet-400 animate-pulse-soft" />
            {t("dashboard.title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        {me?.role !== "viewer" && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> {t("dashboard.quick_add")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Stat icon={<ListTodo className="h-4.5 w-4.5" />} label={t("dashboard.total_tasks")} value={stats.total} color="from-blue-500 to-violet-500" />
        <Stat icon={<Clock3 className="h-4.5 w-4.5" />} label={t("dashboard.in_progress")} value={stats.inProgress} color="from-orange-500 to-pink-500" />
        <Stat icon={<CheckCircle2 className="h-4.5 w-4.5" />} label={t("dashboard.posted")} value={stats.posted} color="from-emerald-500 to-teal-400" />
        <Stat icon={<CalendarClock className="h-4.5 w-4.5" />} label={t("dashboard.pending_approval")} value={stats.pending} color="from-violet-500 to-fuchsia-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="p-5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-base font-semibold text-foreground">{t("dashboard.upcoming_posts")}</div>
              <div className="text-xs text-muted-foreground">{t("dashboard.upcoming_subtitle")}</div>
            </div>
            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <div className="flex items-center gap-1 p-0.5 bg-white/20 dark:bg-white/5 border border-white/10 rounded-xl">
                <button
                  onClick={() => setSortMode("due_date")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    sortMode === "due_date"
                      ? "bg-violet-600 text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("dashboard.sort_by_due_date")}
                </button>
                <button
                  onClick={() => setSortMode("smart_priority")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    sortMode === "smart_priority"
                      ? "bg-brand-gradient text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("dashboard.sort_by_smart")}
                </button>
              </div>
              <Link href="/content-planner/planner" className="text-xs text-violet-600 hover:underline shrink-0">
                {t("dashboard.view_all")}
              </Link>
            </div>
          </div>
          <CardContent className="p-0">
            {upcoming.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                {t("dashboard.nothing_scheduled")}
              </div>
            )}
            <ul className="divide-y divide-violet-100/10 dark:divide-white/5">
              {upcoming.map(({ task, score }) => {
                const product = products.find((p) => p.name === task.product);
                const platform = platforms.find((p) => p.name === task.platform);
                const owner = profiles.find((p) => p.id === task.owner_id);
                return (
                  <li
                    key={task.id}
                    onClick={() => setDetail(task)}
                    className="p-4 hover:bg-white/40 dark:hover:bg-white/5 cursor-pointer flex items-center gap-3 transition-all duration-200 hover:scale-[1.002] active:scale-[0.998]"
                  >
                    <div className="w-14 shrink-0 text-center">
                      {task.scheduled_date ? (
                        <>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                            {new Date(task.scheduled_date).toLocaleDateString("en-US", { month: "short" })}
                          </div>
                          <div className="text-xl font-bold text-violet-600 leading-none">
                            {new Date(task.scheduled_date).getDate()}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {task.post_time?.slice(0, 5) ?? ""}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-muted-foreground font-bold py-2">—</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                        <div className="text-sm font-semibold text-foreground truncate">{task.topic}</div>
                        {getPriorityBadge(score)}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {platform && <ColorTag name={platform.name} color={platform.color} />}
                        {product && <ColorTag name={product.name} color={product.color} />}
                        <ProgressBadge value={task.progress_status} />
                        <PostBadge value={task.post_status} />
                        <ApprovalBadge value={task.approval_status} />
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-pink-gradient-strong text-white grid place-items-center text-[10px] font-semibold select-none">
                        {initials(owner?.full_name)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <div className="p-5 border-b border-border/50">
            <div className="text-base font-semibold text-foreground">{t("dashboard.recent_activity")}</div>
            <div className="text-xs text-muted-foreground">{t("dashboard.recent_activity_subtitle")}</div>
          </div>
          <CardContent className="p-0 max-h-[480px] overflow-y-auto">
            {activity.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">{t("dashboard.no_activity")}</div>
            )}
            <ul className="divide-y divide-violet-100/10 dark:divide-white/5">
              {activity.slice(0, 25).map((a) => {
                const author = profiles.find((p) => p.id === a.user_id);
                const task = tasks.find((t) => t.id === a.task_id);
                return (
                  <li key={a.id} className="p-3 text-sm flex gap-2.5 hover:bg-white/30 dark:hover:bg-white/5 transition-all duration-200">
                    <div className="h-7 w-7 rounded-full bg-violet-100 text-violet-700 grid place-items-center text-[10px] font-bold shrink-0">
                      {initials(author?.full_name)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-foreground">
                        <span className="font-medium">{author?.full_name ?? "System"}</span>{" "}
                        <span className="text-muted-foreground">{tAction(a.action)}</span>
                      </div>
                      {task && (
                        <div className="text-xs text-muted-foreground truncate">{task.topic}</div>
                      )}
                      <div className="text-[10px] text-muted-foreground">{formatDate(a.created_at)}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      <TaskDetailModal open={!!detail} onOpenChange={(o) => !o && setDetail(null)} task={detail} />
      <TaskModal open={showCreate} onOpenChange={setShowCreate} />
      <SmartReminderModal onSelectTask={(task) => setDetail(task)} />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card className="hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300">
      <CardContent className="p-4 flex items-center gap-4.5">
        <div className={`h-11 w-11 rounded-xl text-white grid place-items-center bg-gradient-to-br ${color} shadow-lg shadow-violet-500/5 dark:shadow-violet-950/10 shrink-0`}>
          {icon}
        </div>
        <div>
          <div className="text-xs font-bold text-muted-foreground/80 tracking-wide uppercase">{label}</div>
          <div className="text-2xl font-extrabold text-foreground leading-none mt-1">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
