import type { ContentTask, Profile } from "./types";
import { postLabel, progressLabel, approvalLabel } from "./constants";

const HEADERS = [
  "Week",
  "Start date",
  "Due date",
  "Date",
  "Day",
  "Time",
  "Workday",
  "Platform",
  "Product",
  "Topic",
  "Type",
  "Progress",
  "Post status",
  "Approval",
  "Owner",
  "Caption",
  "Creative brief",
  "Note",
  "File URL",
  "Created at",
  "Updated at",
];

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function filterTasksByDays(tasks: ContentTask[], days: number): ContentTask[] {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const since = new Date(today);
  since.setDate(since.getDate() - days + 1);
  since.setHours(0, 0, 0, 0);

  return tasks.filter((t) => {
    if (!t.scheduled_date) return false;
    const d = new Date(t.scheduled_date);
    return d >= since && d <= today;
  });
}

export function tasksToCsv(tasks: ContentTask[], profiles: Profile[]): string {
  const rows = tasks.map((t) => {
    const owner = profiles.find((p) => p.id === t.owner_id);
    return [
      t.week_group ?? "",
      t.start_date ?? "",
      t.due_date ?? "",
      t.scheduled_date ?? "",
      t.day_name ?? "",
      t.post_time ?? "",
      t.workday_status ?? "",
      t.platform ?? "",
      t.product ?? "",
      t.topic ?? "",
      t.content_type ?? "",
      progressLabel(t.progress_status),
      postLabel(t.post_status),
      approvalLabel(t.approval_status),
      owner?.full_name ?? "",
      t.caption ?? "",
      t.creative_brief ?? "",
      t.note ?? "",
      t.file_url ?? "",
      t.created_at ?? "",
      t.updated_at ?? "",
    ].map(csvEscape).join(",");
  });

  return [HEADERS.map(csvEscape).join(","), ...rows].join("\r\n");
}

export function filterTasksByMonth(tasks: ContentTask[], yyyymm: string): ContentTask[] {
  return tasks.filter((t) => t.scheduled_date?.startsWith(yyyymm));
}

function triggerCsvDownload(csv: string, filename: string) {
  // BOM for Excel/Google Sheets to recognize UTF-8 (Thai chars)
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadTasksCsv(
  tasks: ContentTask[],
  profiles: Profile[],
  days: number
) {
  const filtered = filterTasksByDays(tasks, days);
  const csv = tasksToCsv(filtered, profiles);
  const today = new Date().toISOString().slice(0, 10);
  triggerCsvDownload(csv, `content-planner-${days}d-${today}.csv`);
}

export function downloadTasksCsvByMonth(
  tasks: ContentTask[],
  profiles: Profile[],
  yyyymm: string
) {
  const filtered = filterTasksByMonth(tasks, yyyymm);
  const csv = tasksToCsv(filtered, profiles);
  triggerCsvDownload(csv, `content-planner-${yyyymm}.csv`);
}
