"use client";
import * as React from "react";
import { useData } from "@/components/content-planner/data-provider";
import { Card } from "@/components/content-planner/ui/card";
import { Button } from "@/components/content-planner/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ColorTag, PostBadge } from "@/components/content-planner/status-badge";
import { TaskDetailModal } from "@/components/content-planner/task-detail-modal";
import type { ContentTask } from "@/lib/content-planner/types";
import { cn } from "@/lib/content-planner/utils";
import { useLang, useT } from "@/lib/content-planner/i18n";

const DAY_KEYS = [
  "calendar.day.mon",
  "calendar.day.tue",
  "calendar.day.wed",
  "calendar.day.thu",
  "calendar.day.fri",
  "calendar.day.sat",
  "calendar.day.sun",
];

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

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDayIdx; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

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

  function key(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  const today = new Date();
  const todayKey = key(today);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t("calendar.title")}</h1>
          <p className="text-sm text-slate-500">{t("calendar.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month - 1, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-semibold text-slate-700 min-w-[140px] text-center">
            {cursor.toLocaleDateString(locale, { month: "long", year: "numeric" })}
          </div>
          <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month + 1, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {
            const d = new Date();
            setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
          }}>
            {t("calendar.today")}
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-7 border-b border-violet-100 bg-violet-50/60">
          {DAY_KEYS.map((k) => (
            <div key={k} className="p-2 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">
              {t(k)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            const dayTasks = d ? tasksByDay.get(key(d)) ?? [] : [];
            const isToday = d && key(d) === todayKey;
            return (
              <div
                key={i}
                className={cn(
                  "min-h-[120px] border-b border-r border-violet-100 p-2 last:border-r-0 flex flex-col gap-1",
                  !d && "bg-violet-50/30",
                  isToday && "bg-violet-50/70"
                )}
              >
                {d && (
                  <div className="flex items-center justify-between mb-1">
                    <div
                      className={cn(
                        "text-xs font-semibold",
                        isToday
                          ? "h-6 w-6 rounded-full bg-pink-gradient-strong text-white grid place-items-center"
                          : "text-slate-500"
                      )}
                    >
                      {d.getDate()}
                    </div>
                    {dayTasks.length > 0 && (
                      <span className="text-[10px] text-slate-400">{dayTasks.length}</span>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-1 overflow-hidden">
                  {dayTasks.slice(0, 3).map((t) => {
                    const platform = platforms.find((p) => p.name === t.platform);
                    const product = products.find((p) => p.name === t.product);
                    const color = product?.color ?? platform?.color ?? "#ec4899";
                    return (
                      <button
                        key={t.id}
                        onClick={() => setDetail(t)}
                        className="text-left text-[11px] rounded-md px-2 py-1 truncate"
                        style={{
                          background: `${color}1a`,
                          color,
                          boxShadow: `inset 0 0 0 1px ${color}40`,
                        }}
                        title={t.topic}
                      >
                        <span className="font-semibold">
                          {t.post_time?.slice(0, 5) ?? ""}
                        </span>{" "}
                        {t.topic}
                      </button>
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] text-slate-400 px-1">
                      {t("calendar.more", { n: dayTasks.length - 3 })}
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
