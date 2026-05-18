"use client";
import * as React from "react";
import Link from "next/link";
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
import { useT } from "@/lib/content-planner/i18n";
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
  const [detail, setDetail] = React.useState<ContentTask | null>(null);
  const [showCreate, setShowCreate] = React.useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = tasks
    .filter((t) => t.scheduled_date && t.scheduled_date >= today && t.post_status !== "posted")
    .sort((a, b) => (a.scheduled_date ?? "").localeCompare(b.scheduled_date ?? ""))
    .slice(0, 6);

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) =>
      ["thinking_topic", "writing_script", "filming", "editing", "waiting_comment"].includes(t.progress_status)
    ).length,
    posted: tasks.filter((t) => t.post_status === "posted").length,
    pending: tasks.filter((t) => t.approval_status === "pending").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            {t("dashboard.title")}
          </h1>
          <p className="text-sm text-slate-500">{t("dashboard.subtitle")}</p>
        </div>
        {me?.role !== "viewer" && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> {t("dashboard.quick_add")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={<ListTodo className="h-4 w-4" />} label={t("dashboard.total_tasks")} value={stats.total} color="from-blue-500 to-violet-500" />
        <Stat icon={<Clock3 className="h-4 w-4" />} label={t("dashboard.in_progress")} value={stats.inProgress} color="from-orange-500 to-pink-500" />
        <Stat icon={<CheckCircle2 className="h-4 w-4" />} label={t("dashboard.posted")} value={stats.posted} color="from-emerald-500 to-teal-400" />
        <Stat icon={<CalendarClock className="h-4 w-4" />} label={t("dashboard.pending_approval")} value={stats.pending} color="from-violet-500 to-fuchsia-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="p-5 border-b border-violet-100 flex items-center justify-between">
            <div>
              <div className="text-base font-semibold text-slate-800">{t("dashboard.upcoming_posts")}</div>
              <div className="text-xs text-slate-500">{t("dashboard.upcoming_subtitle")}</div>
            </div>
            <Link href="/content-planner/planner" className="text-xs text-violet-600 hover:underline">
              {t("dashboard.view_all")}
            </Link>
          </div>
          <CardContent className="p-0">
            {upcoming.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">
                {t("dashboard.nothing_scheduled")}
              </div>
            )}
            <ul className="divide-y divide-violet-100">
              {upcoming.map((t) => {
                const product = products.find((p) => p.name === t.product);
                const platform = platforms.find((p) => p.name === t.platform);
                const owner = profiles.find((p) => p.id === t.owner_id);
                return (
                  <li
                    key={t.id}
                    onClick={() => setDetail(t)}
                    className="p-4 hover:bg-violet-50/50 cursor-pointer flex items-center gap-3"
                  >
                    <div className="w-14 shrink-0 text-center">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                        {new Date(t.scheduled_date!).toLocaleDateString("en-US", { month: "short" })}
                      </div>
                      <div className="text-xl font-bold text-violet-600 leading-none">
                        {new Date(t.scheduled_date!).getDate()}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {t.post_time?.slice(0, 5) ?? ""}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-800 truncate">{t.topic}</div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {platform && <ColorTag name={platform.name} color={platform.color} />}
                        {product && <ColorTag name={product.name} color={product.color} />}
                        <ProgressBadge value={t.progress_status} />
                        <PostBadge value={t.post_status} />
                        <ApprovalBadge value={t.approval_status} />
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-pink-gradient-strong text-white grid place-items-center text-[10px] font-semibold">
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
          <div className="p-5 border-b border-violet-100">
            <div className="text-base font-semibold text-slate-800">{t("dashboard.recent_activity")}</div>
            <div className="text-xs text-slate-500">{t("dashboard.recent_activity_subtitle")}</div>
          </div>
          <CardContent className="p-0 max-h-[480px] overflow-y-auto">
            {activity.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">{t("dashboard.no_activity")}</div>
            )}
            <ul className="divide-y divide-violet-100">
              {activity.slice(0, 25).map((a) => {
                const author = profiles.find((p) => p.id === a.user_id);
                const task = tasks.find((t) => t.id === a.task_id);
                return (
                  <li key={a.id} className="p-3 text-sm flex gap-2">
                    <div className="h-7 w-7 rounded-full bg-violet-100 text-violet-700 grid place-items-center text-[10px] font-bold shrink-0">
                      {initials(author?.full_name)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-slate-700">
                        <span className="font-medium">{author?.full_name ?? "System"}</span>{" "}
                        <span className="text-slate-500">{a.action.replace(/_/g, " ")}</span>
                      </div>
                      {task && (
                        <div className="text-xs text-slate-500 truncate">{task.topic}</div>
                      )}
                      <div className="text-[10px] text-slate-400">{formatDate(a.created_at)}</div>
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
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl text-white grid place-items-center bg-gradient-to-br ${color}`}>
          {icon}
        </div>
        <div>
          <div className="text-xs text-slate-500">{label}</div>
          <div className="text-2xl font-bold text-slate-800 leading-none">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
