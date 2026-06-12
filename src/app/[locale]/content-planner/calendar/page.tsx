"use client";
import * as React from "react";
import { useData } from "@/components/content-planner/data-provider";
import { Card } from "@/components/content-planner/ui/card";
import { Button } from "@/components/content-planner/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TaskDetailModal } from "@/components/content-planner/task-detail-modal";
import { POST_LABELS, PROGRESS_LABELS, useLang, useT } from "@/lib/content-planner/i18n";
import type { ContentTask } from "@/lib/content-planner/types";
import { cn } from "@/lib/content-planner/utils";

const DAY_KEYS = [
  "calendar.day.mon",
  "calendar.day.tue",
  "calendar.day.wed",
  "calendar.day.thu",
  "calendar.day.fri",
  "calendar.day.sat",
  "calendar.day.sun",
];

const MAX_VISIBLE_TASKS = 2;

export default function CalendarPage() {
  const { tasks, platforms, products } = useData();
  const t = useT();
  const { lang } = useLang();
  const locale = lang === "th" ? "th-TH" : "en-US";
  const [cursor, setCursor] = React.useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [detail, setDetail] = React.useState<ContentTask | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDayIdx = (firstDay.getDay() + 6) % 7; // make Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = React.useMemo(() => {
    const monthCells: (Date | null)[] = [];
    for (let i = 0; i < startDayIdx; i++) monthCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) monthCells.push(new Date(year, month, d));
    while (monthCells.length % 7 !== 0) monthCells.push(null);
    return monthCells;
  }, [daysInMonth, month, startDayIdx, year]);

  const tasksByDay = React.useMemo(() => {
    const map = new Map<string, ContentTask[]>();
    tasks.forEach((t) => {
      if (!t.scheduled_date) return;
      const arr = map.get(t.scheduled_date) ?? [];
      arr.push(t);
      map.set(t.scheduled_date, arr);
    });
    return map;
  }, [tasks]);

  const monthAgenda = React.useMemo(
    () =>
      cells
        .filter((d): d is Date => Boolean(d))
        .map((date) => ({ date, dayTasks: tasksByDay.get(key(date)) ?? [] }))
        .filter((item) => item.dayTasks.length > 0),
    [cells, tasksByDay]
  );

  function key(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  const today = new Date();
  const todayKey = key(today);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 select-none">
            {t("calendar.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("calendar.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-[#111827]">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4 text-foreground/80" />
          </Button>
          <div className="text-sm font-bold text-foreground min-w-[130px] text-center select-none">
            {cursor.toLocaleDateString(locale, { month: "long", year: "numeric" })}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4 text-foreground/80" />
          </Button>
          <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const d = new Date();
              setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
            }}
            className="h-9 px-3 text-xs"
          >
            {t("calendar.today")}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 lg:hidden">
        {monthAgenda.length === 0 && (
          <Card>
            <div className="p-8 text-center text-sm text-muted-foreground">
              {t("calendar.no_tasks_month")}
            </div>
          </Card>
        )}
        {monthAgenda.map(({ date, dayTasks }) => (
          <Card key={key(date)}>
            <div className="border-b border-slate-100 p-4 dark:border-white/10">
              <div className="text-sm font-bold text-slate-950 dark:text-slate-50">
                {date.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("calendar.tasks_count", { n: dayTasks.length })}
              </div>
            </div>
            <div className="grid gap-2 p-3">
              {dayTasks.map((task) => {
                const platform = platforms.find((p) => p.name === task.platform);
                const product = products.find((p) => p.name === task.product);
                const color = product?.color ?? platform?.color ?? "#7c3aed";
                const productOrPlatform = product?.name ?? platform?.name ?? null;
                const progress = PROGRESS_LABELS[lang][task.progress_status];

                return (
                  <button
                    key={task.id}
                    onClick={() => setDetail(task)}
                    className="rounded-lg border p-3 text-left transition-colors hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-white/5"
                    style={{ borderColor: `${color}35` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold" style={{ color }}>
                          <span>{task.post_time?.slice(0, 5) ?? "--:--"}</span>
                          {task.content_type && <span className="text-muted-foreground">• {task.content_type}</span>}
                        </div>
                        <div className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-slate-950 dark:text-slate-50">
                          {task.topic}
                        </div>
                      </div>
                      {productOrPlatform && (
                        <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset" style={{ background: `${color}14`, color, boxShadow: `inset 0 0 0 1px ${color}30` }}>
                          {productOrPlatform}
                        </span>
                      )}
                    </div>
                    {progress !== "-" && (
                      <div className="mt-2 text-xs text-muted-foreground">{progress}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <Card className="hidden overflow-hidden border border-slate-300/80 dark:border-white/10 lg:block">
        <div className="grid grid-cols-7 border-b border-slate-300/80 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md">
          {DAY_KEYS.map((k) => (
            <div
              key={k}
              className="p-3 text-sm font-extrabold tracking-normal text-slate-700 dark:text-slate-200 text-center select-none border-l first:border-l-0 border-slate-300/80 dark:border-white/10"
            >
              {t(k)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-white/35 dark:bg-black/5 divide-x divide-y divide-slate-300/75 dark:divide-white/10 -mt-[1px] -ml-[1px]">
          {cells.map((d, i) => {
            const dayTasks = d ? tasksByDay.get(key(d)) ?? [] : [];
            const isToday = d && key(d) === todayKey;
            return (
              <div
                key={i}
                className={cn(
                  "min-h-[170px] xl:min-h-[185px] p-2.5 flex flex-col gap-1.5 transition-all duration-300 relative border-t border-l border-slate-300/75 dark:border-white/10",
                  !d && "bg-white/5 dark:bg-[#0a1128]/5 opacity-40 cursor-not-allowed",
                  d && "hover:bg-white/60 dark:hover:bg-white/5",
                  isToday && "bg-pink-500/5 dark:bg-pink-500/10 after:absolute after:inset-0 after:pointer-events-none after:border after:border-pink-500/20 dark:after:border-pink-500/30"
                )}
              >
                {d && (
                  <div className="flex items-center justify-between mb-0.5">
                    <div
                      className={cn(
                        "text-xs font-bold transition-all select-none",
                        isToday
                          ? "h-6 w-6 rounded-lg bg-pink-gradient text-white grid place-items-center shadow-lg shadow-pink-500/15"
                          : "text-muted-foreground/90 group-hover:text-foreground"
                      )}
                    >
                      {d.getDate()}
                    </div>
                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-semibold text-muted-foreground/85 px-1.5 py-0.5 rounded-full bg-white/40 dark:bg-[#131a30]/40 border border-white/25 dark:border-white/5">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-1 overflow-hidden mt-1">
                  {dayTasks.slice(0, MAX_VISIBLE_TASKS).map((task) => {
                    const platform = platforms.find((p) => p.name === task.platform);
                    const product = products.find((p) => p.name === task.product);
                    const color = product?.color ?? platform?.color ?? "#ec4899";
                    const productOrPlatform = product?.name ?? platform?.name ?? null;
                    const progress = PROGRESS_LABELS[lang][task.progress_status];
                    const post = POST_LABELS[lang][task.post_status];
                    const title = [
                      task.post_time?.slice(0, 5),
                      task.topic,
                      task.content_type,
                      productOrPlatform,
                      progress,
                      post,
                    ].filter(Boolean).join(" • ");

                    return (
                      <button
                        key={task.id}
                        onClick={() => setDetail(task)}
                        className="group/event text-left rounded-xl px-2 py-1.5 font-medium hover:scale-[1.01] active:scale-[0.99] transition-all border border-transparent shadow-sm hover:shadow-md cursor-pointer overflow-hidden"
                        style={{
                          background: `${color}15`,
                          color,
                          borderColor: `${color}25`,
                        }}
                        title={title}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[10px] font-extrabold tabular-nums opacity-85">
                            {task.post_time?.slice(0, 5) ?? "--:--"}
                          </span>
                          {task.content_type && (
                            <span className="min-w-0 truncate rounded-full bg-white/70 dark:bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-foreground/75 ring-1 ring-black/5 dark:ring-white/10">
                              {task.content_type}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 line-clamp-2 text-[11px] leading-snug font-bold text-foreground/90 group-hover/event:text-foreground">
                          {task.topic}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                          {productOrPlatform && (
                            <span
                              className="max-w-full truncate rounded-full px-1.5 py-0.5 text-[9px] font-bold ring-1 ring-inset"
                              style={{
                                background: `${color}18`,
                                color,
                                boxShadow: `inset 0 0 0 1px ${color}35`,
                              }}
                            >
                              {productOrPlatform}
                            </span>
                          )}
                          {progress !== "-" && (
                            <span className="max-w-full truncate rounded-full bg-white/65 dark:bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-foreground/70 ring-1 ring-black/5 dark:ring-white/10">
                              {progress}
                            </span>
                          )}
                          {post !== "-" && (
                            <span className="max-w-full truncate rounded-full bg-white/65 dark:bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-foreground/70 ring-1 ring-black/5 dark:ring-white/10">
                              {post}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  {dayTasks.length > MAX_VISIBLE_TASKS && (
                    <div className="text-[10px] font-semibold text-muted-foreground/70 px-1 mt-0.5">
                      {t("calendar.more", { n: dayTasks.length - MAX_VISIBLE_TASKS })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <TaskDetailModal open={!!detail} onOpenChange={(o) => !o && setDetail(null)} task={detail} />
    </div>
  );
}
