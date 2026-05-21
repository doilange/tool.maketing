"use client";
import * as React from "react";
import { useData } from "@/components/content-planner/data-provider";
import { Card } from "@/components/content-planner/ui/card";
import { Button } from "@/components/content-planner/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Removed unused imports from status-badge
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-brand-gradient select-none">
            {t("calendar.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("calendar.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto bg-white/40 dark:bg-[#0a1128]/40 border border-white/20 dark:border-white/5 rounded-2xl p-1 backdrop-blur-xl shadow-sm">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="h-8 w-8 rounded-xl border-white/20 dark:border-white/5 hover:bg-white/60 dark:hover:bg-[#131a30]/60"
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
            className="h-8 w-8 rounded-xl border-white/20 dark:border-white/5 hover:bg-white/60 dark:hover:bg-[#131a30]/60"
          >
            <ChevronRight className="h-4 w-4 text-foreground/80" />
          </Button>
          <div className="w-[1px] h-5 bg-white/20 dark:bg-white/10 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const d = new Date();
              setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
            }}
            className="h-8 px-3 rounded-xl text-xs font-semibold hover:bg-white/60 dark:hover:bg-[#131a30]/60 text-violet-600 dark:text-violet-400"
          >
            {t("calendar.today")}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden shadow-2xl border-white/20 dark:border-white/5">
        <div className="grid grid-cols-7 border-b border-white/10 dark:border-white/5 bg-white/30 dark:bg-white/5 backdrop-blur-md">
          {DAY_KEYS.map((k) => (
            <div key={k} className="p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 text-center select-none">
              {t(k)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-white/10 dark:bg-black/5 divide-x divide-y divide-white/10 dark:divide-white/5 -mt-[1px] -ml-[1px]">
          {cells.map((d, i) => {
            const dayTasks = d ? tasksByDay.get(key(d)) ?? [] : [];
            const isToday = d && key(d) === todayKey;
            return (
              <div
                key={i}
                className={cn(
                  "min-h-[125px] p-2.5 flex flex-col gap-1.5 transition-all duration-300 relative border-t border-l border-white/10 dark:border-white/5",
                  !d && "bg-white/5 dark:bg-[#0a1128]/5 opacity-40 cursor-not-allowed",
                  d && "hover:bg-white/30 dark:hover:bg-white/5",
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
                  {dayTasks.slice(0, 3).map((t) => {
                    const platform = platforms.find((p) => p.name === t.platform);
                    const product = products.find((p) => p.name === t.product);
                    const color = product?.color ?? platform?.color ?? "#ec4899";
                    return (
                      <button
                        key={t.id}
                        onClick={() => setDetail(t)}
                        className="text-left text-[11px] rounded-lg px-2 py-1.5 truncate font-medium hover:scale-[1.02] active:scale-[0.98] transition-all border border-transparent shadow-sm hover:shadow-md cursor-pointer"
                        style={{
                          background: `${color}15`,
                          color,
                          borderColor: `${color}25`,
                        }}
                        title={t.topic}
                      >
                        <span className="font-bold opacity-80 mr-1.5">
                          {t.post_time?.slice(0, 5) ?? ""}
                        </span>
                        {t.topic}
                      </button>
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] font-semibold text-muted-foreground/70 px-1 mt-0.5">
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
