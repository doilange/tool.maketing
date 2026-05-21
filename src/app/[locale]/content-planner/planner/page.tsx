"use client";
import * as React from "react";
import { useData } from "@/components/content-planner/data-provider";
import { TaskModal } from "@/components/content-planner/task-modal";
import { TaskDetailModal } from "@/components/content-planner/task-detail-modal";
import { Button } from "@/components/content-planner/ui/button";
import { Input } from "@/components/content-planner/ui/input";
import { Select } from "@/components/content-planner/ui/select";
import { Card, CardContent } from "@/components/content-planner/ui/card";
import {
  ApprovalBadge,
  ColorTag,
  PostBadge,
  ProgressBadge,
} from "@/components/content-planner/status-badge";
import { formatDate, formatDateTime } from "@/lib/content-planner/utils";
import { Download, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { downloadTasksCsv, downloadTasksCsvByMonth } from "@/lib/content-planner/export";
import type { ContentTask } from "@/lib/content-planner/types";
import { usePostOptions, useProgressOptions, useT } from "@/lib/content-planner/i18n";

export default function PlannerPage() {
  const { tasks, profiles, products, platforms, me, deleteTask } = useData();
  const t = useT();
  const progressOptions = useProgressOptions();
  const postOptions = usePostOptions();

  const [search, setSearch] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [week, setWeek] = React.useState("");
  const [platform, setPlatform] = React.useState("");
  const [product, setProduct] = React.useState("");
  const [owner, setOwner] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [postStatus, setPostStatus] = React.useState("");

  const [editing, setEditing] = React.useState<ContentTask | null>(null);
  const [showCreate, setShowCreate] = React.useState(false);
  const [detail, setDetail] = React.useState<ContentTask | null>(null);

  const months = React.useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((task) => {
      if (task.scheduled_date) set.add(task.scheduled_date.slice(0, 7));
    });
    return Array.from(set).sort();
  }, [tasks]);
  const weeks = React.useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((task) => task.week_group && set.add(task.week_group));
    return Array.from(set).sort();
  }, [tasks]);

  const filtered = tasks.filter((task) => {
    if (search && !task.topic.toLowerCase().includes(search.toLowerCase())) return false;
    if (month && (!task.scheduled_date || !task.scheduled_date.startsWith(month))) return false;
    if (week && task.week_group !== week) return false;
    if (platform && task.platform !== platform) return false;
    if (product && task.product !== product) return false;
    if (owner && task.owner_id !== owner) return false;
    if (status && task.progress_status !== status) return false;
    if (postStatus && task.post_status !== postStatus) return false;
    return true;
  });

  const canEdit = me?.role !== "viewer";
  const canDelete = me?.role !== "viewer";

  async function remove(id: string) {
    if (!confirm(t("planner.delete_confirm"))) return;
    try {
      await deleteTask(id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`${t("planner.delete_failed") ?? "ลบไม่สำเร็จ"}: ${msg}`);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-brand-gradient flex items-center gap-2 select-none">
            {t("planner.title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("planner.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu
            onExportDays={(days) => downloadTasksCsv(tasks, profiles, days)}
            onExportMonth={(m) => downloadTasksCsvByMonth(tasks, profiles, m)}
          />
          {canEdit && (
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4" /> {t("planner.new_task")}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
          <div className="col-span-2 md:col-span-2 xl:col-span-2 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-7"
              placeholder={t("planner.search_topic")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">{t("planner.all_months")}</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
          <Select value={week} onChange={(e) => setWeek(e.target.value)}>
            <option value="">{t("planner.all_weeks")}</option>
            {weeks.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </Select>
          <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="">{t("planner.all_platforms")}</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </Select>
          <Select value={product} onChange={(e) => setProduct(e.target.value)}>
            <option value="">{t("planner.all_products")}</option>
            {products.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </Select>
          <Select value={owner} onChange={(e) => setOwner(e.target.value)}>
            <option value="">{t("planner.all_owners")}</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name ?? p.id.slice(0, 6)}
              </option>
            ))}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">{t("planner.all_progress")}</option>
            {progressOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          <Select value={postStatus} onChange={(e) => setPostStatus(e.target.value)}>
            <option value="">{t("planner.all_post_status")}</option>
            {postOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/20 dark:bg-white/5 text-muted-foreground/90 select-none">
              <tr className="text-left">
                <Th>{t("table.week")}</Th>
                <Th>{t("table.date")}</Th>
                <Th>{t("table.day")}</Th>
                <Th>{t("table.time")}</Th>
                <Th>{t("table.workday")}</Th>
                <Th>{t("table.platform")}</Th>
                <Th>{t("table.product")}</Th>
                <Th>{t("table.topic")}</Th>
                <Th>{t("table.type")}</Th>
                <Th>{t("table.progress")}</Th>
                <Th>{t("table.post")}</Th>
                <Th>{t("table.approval")}</Th>
                <Th>{t("table.owner")}</Th>
                <Th>{t("table.file")}</Th>
                <Th>{t("table.note")}</Th>
                <Th>{t("table.updated")}</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={17} className="p-8 text-center text-muted-foreground">
                    {t("planner.no_match")}
                  </td>
                </tr>
              )}
              {filtered.map((task) => {
                const product = products.find((p) => p.name === task.product);
                const platform = platforms.find((p) => p.name === task.platform);
                const ownerProfile = profiles.find((p) => p.id === task.owner_id);
                return (
                  <tr
                    key={task.id}
                    onClick={() => setDetail(task)}
                    className="border-t border-white/10 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <Td>{task.week_group ?? "—"}</Td>
                    <Td>{formatDate(task.scheduled_date)}</Td>
                    <Td>{task.day_name ?? "—"}</Td>
                    <Td>{task.post_time?.slice(0, 5) ?? "—"}</Td>
                    <Td>
                      <span className="text-xs capitalize">{task.workday_status}</span>
                    </Td>
                    <Td>
                      {platform ? <ColorTag name={platform.name} color={platform.color} /> : "—"}
                    </Td>
                    <Td>
                      {product ? <ColorTag name={product.name} color={product.color} /> : "—"}
                    </Td>
                    <Td className="max-w-[260px] truncate font-medium text-foreground">
                      {task.topic}
                    </Td>
                    <Td>{task.content_type ?? "—"}</Td>
                    <Td>
                      <ProgressBadge value={task.progress_status} />
                    </Td>
                    <Td>
                      <PostBadge value={task.post_status} />
                    </Td>
                    <Td>
                      <ApprovalBadge value={task.approval_status} />
                    </Td>
                    <Td>{ownerProfile?.full_name ?? "—"}</Td>
                    <Td>
                      {task.file_url ? (
                        <a
                          onClick={(e) => e.stopPropagation()}
                          href={task.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-violet-600 hover:underline"
                        >
                          {t("common.open")}
                        </a>
                      ) : (
                        "—"
                      )}
                    </Td>
                    <Td className="max-w-[200px] truncate text-muted-foreground">{task.note ?? "—"}</Td>
                    <Td className="text-xs text-muted-foreground">{formatDateTime(task.updated_at)}</Td>
                    <Td>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        {canEdit && (
                          <Button variant="ghost" size="icon" onClick={() => setEditing(task)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {canDelete && task.approval_status !== "approved" && (
                          <Button variant="ghost" size="icon" onClick={() => remove(task.id)} title={t("planner.delete_confirm")}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <TaskModal open={showCreate} onOpenChange={setShowCreate} />
      <TaskModal open={!!editing} onOpenChange={(o) => !o && setEditing(null)} task={editing} />
      <TaskDetailModal open={!!detail} onOpenChange={(o) => !o && setDetail(null)} task={detail} />
    </div>
  );
}

function ExportMenu({
  onExportDays,
  onExportMonth,
}: {
  onExportDays: (days: number) => void;
  onExportMonth: (yyyymm: string) => void;
}) {
  const t = useT();
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState(() => new Date().toISOString().slice(0, 7));
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const options: { days: number; key: string }[] = [
    { days: 7, key: "export.last_7" },
    { days: 30, key: "export.last_30" },
    { days: 90, key: "export.last_90" },
  ];

  return (
    <div className="relative" ref={ref}>
      <Button variant="outline" onClick={() => setOpen((o) => !o)}>
        <Download className="h-4 w-4" /> {t("export.button")}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2.5 z-30 w-56 rounded-2xl border border-white/20 dark:border-white/5 bg-white/95 dark:bg-[#131a30]/95 backdrop-blur-2xl shadow-2xl p-1.5 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          {options.map((o) => (
            <button
              key={o.days}
              onClick={() => {
                onExportDays(o.days);
                setOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm rounded-xl font-medium text-foreground hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              {t(o.key)}
            </button>
          ))}
          <div className="border-t border-white/10 dark:border-white/5 mt-1.5 pt-2.5 pb-1 px-2.5 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground/80 font-bold">
              {t("export.select_month")}
            </div>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full rounded-xl border border-border/80 dark:border-white/10 bg-white/40 dark:bg-[#0a1128]/40 px-2 py-1.5 text-xs text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all"
            />
            <Button
              size="sm"
              className="w-full mt-1 font-bold text-xs"
              onClick={() => {
                if (!month) return;
                onExportMonth(month);
                setOpen(false);
              }}
            >
              {t("export.download_month")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="text-xs font-semibold uppercase tracking-wide px-3 py-2 whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 whitespace-nowrap ${className}`}>{children}</td>;
}
