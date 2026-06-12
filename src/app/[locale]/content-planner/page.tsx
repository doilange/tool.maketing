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
import { formatDate, initials } from "@/lib/content-planner/utils";
import { useT, useActivityAction } from "@/lib/content-planner/i18n";
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  ListTodo,
  Plus,
} from "lucide-react";
import type { ContentTask } from "@/lib/content-planner/types";

type DashboardRange = "today" | "week" | "month";

export default function DashboardPage() {
  const { tasks, profiles, products, platforms, me, activity } = useData();
  const t = useT();
  const tAction = useActivityAction();
  const [detail, setDetail] = React.useState<ContentTask | null>(null);
  const [showCreate, setShowCreate] = React.useState(false);

  const [sortMode, setSortMode] = React.useState<"due_date" | "smart_priority">("smart_priority");
  const [rangeMode, setRangeMode] = React.useState<DashboardRange>("week");
  const today = React.useMemo(() => toDateKey(new Date()), []);
  const range = React.useMemo(() => getDashboardRange(rangeMode, today), [rangeMode, today]);

  const rangedTasks = React.useMemo(
    () => tasks.filter((task) => isDateInRange(task.scheduled_date, range.start, range.end)),
    [tasks, range.start, range.end]
  );

  const rangedActivity = React.useMemo(
    () => activity.filter((item) => isDateInRange(toDateKey(new Date(item.created_at)), range.start, range.end)),
    [activity, range.start, range.end]
  );

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
    const unposted = rangedTasks.filter((t) => t.post_status !== "posted");
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
  }, [rangedTasks, sortMode, today, getPriorityScore]);

  const stats = {
    total: rangedTasks.length,
    inProgress: rangedTasks.filter((t) =>
      ["thinking_topic", "writing_script", "filming", "editing", "waiting_comment"].includes(t.progress_status)
    ).length,
    posted: rangedTasks.filter((t) => t.post_status === "posted").length,
    pending: rangedTasks.filter((t) => t.approval_status === "pending").length,
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 select-none">
            {t("dashboard.title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="grid grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-[#111827]">
            {(["today", "week", "month"] as DashboardRange[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setRangeMode(mode)}
                className={`min-h-9 rounded-md px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  rangeMode === mode
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-white/10"
                }`}
              >
                {t(`dashboard.range_${mode}`)}
              </button>
            ))}
          </div>
          {me?.role !== "viewer" && (
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4" /> {t("dashboard.quick_add")}
            </Button>
          )}
        </div>
      </div>

      <div className="-mt-3 text-xs font-medium text-muted-foreground">
        {t("dashboard.range_showing")}: {range.label}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={<ListTodo className="h-5 w-5" />} label={t("dashboard.total_tasks")} value={stats.total} color="bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300" />
        <Stat icon={<Clock3 className="h-5 w-5" />} label={t("dashboard.in_progress")} value={stats.inProgress} color="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" />
        <Stat icon={<CheckCircle2 className="h-5 w-5" />} label={t("dashboard.posted")} value={stats.posted} color="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" />
        <Stat icon={<CalendarClock className="h-5 w-5" />} label={t("dashboard.pending_approval")} value={stats.pending} color="bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-base font-semibold text-foreground">{t("dashboard.upcoming_posts")}</div>
              <div className="text-xs text-muted-foreground">{t("dashboard.upcoming_subtitle")} · {range.label}</div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-white/5">
                <button
                  onClick={() => setSortMode("due_date")}
                  className={`min-h-8 rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                    sortMode === "due_date"
                      ? "bg-white text-violet-700 shadow-sm dark:bg-[#1f2937] dark:text-violet-300"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("dashboard.sort_by_due_date")}
                </button>
                <button
                  onClick={() => setSortMode("smart_priority")}
                  className={`min-h-8 rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                    sortMode === "smart_priority"
                      ? "bg-white text-violet-700 shadow-sm dark:bg-[#1f2937] dark:text-violet-300"
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
            <ul className="divide-y divide-slate-100 dark:divide-white/10">
              {upcoming.map(({ task, score }) => {
                const product = products.find((p) => p.name === task.product);
                const platform = platforms.find((p) => p.name === task.platform);
                const owner = profiles.find((p) => p.id === task.owner_id);
                return (
                  <li
                    key={task.id}
                    onClick={() => setDetail(task)}
                    className="flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 sm:items-center"
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
                        <div className="line-clamp-2 text-sm font-semibold text-foreground sm:truncate">{task.topic}</div>
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
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 select-none">
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
          <div className="border-b border-slate-200 p-4 dark:border-white/10">
            <div className="text-base font-semibold text-foreground">{t("dashboard.recent_activity")}</div>
            <div className="text-xs text-muted-foreground">{t("dashboard.recent_activity_subtitle")}</div>
          </div>
          <CardContent className="p-0 max-h-[480px] overflow-y-auto">
            {rangedActivity.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">{t("dashboard.no_activity")}</div>
            )}
            <ul className="divide-y divide-slate-100 dark:divide-white/10">
              {rangedActivity.slice(0, 25).map((a) => {
                const author = profiles.find((p) => p.id === a.user_id);
                const task = tasks.find((t) => t.id === a.task_id);
                return (
                  <li key={a.id} className="flex gap-2.5 p-3 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
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
    </div>
  );
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatRangeLabel(start: string, end: string) {
  if (start === end) return formatDate(start);
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function getDashboardRange(mode: DashboardRange, todayKey: string) {
  const today = parseDateKey(todayKey);
  if (mode === "today") {
    return { start: todayKey, end: todayKey, label: formatRangeLabel(todayKey, todayKey) };
  }

  if (mode === "week") {
    const day = today.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = addDays(today, mondayOffset);
    const sunday = addDays(monday, 6);
    const start = toDateKey(monday);
    const end = toDateKey(sunday);
    return { start, end, label: formatRangeLabel(start, end) };
  }

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const start = toDateKey(monthStart);
  const end = toDateKey(monthEnd);
  return { start, end, label: formatRangeLabel(start, end) };
}

function isDateInRange(dateKey: string | null | undefined, start: string, end: string) {
  return Boolean(dateKey && dateKey >= start && dateKey <= end);
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
    <Card>
      <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg sm:h-11 sm:w-11 ${color}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-extrabold leading-none text-foreground">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
