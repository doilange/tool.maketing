import type { ProgressStatus, PostStatus, ApprovalStatus } from "./types";

export const PROGRESS_STATUS_OPTIONS: { value: ProgressStatus; label: string }[] = [
  { value: "none", label: "-" },
  { value: "thinking_topic", label: "💡 กำลังคิดหัวข้อ" },
  { value: "writing_script", label: "📝 เขียนสคริปต์" },
  { value: "filming", label: "🎬 กำลังถ่ายทำ" },
  { value: "editing", label: "✂️ กำลังตัดต่อ" },
  { value: "ready_to_post", label: "✅ พร้อมโพสต์" },
  { value: "waiting_comment", label: "💬 รอคอมเมนต์" },
];

export const POST_STATUS_OPTIONS: { value: PostStatus; label: string }[] = [
  { value: "none", label: "-" },
  { value: "posted", label: "✅ โพสต์แล้ว" },
  { value: "not_posted", label: "❌ ยังไม่ได้โพสต์" },
  { value: "auto_post", label: "🤖 ออโต้โพสต์" },
];

export const APPROVAL_STATUS_OPTIONS: { value: ApprovalStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "needs_edits", label: "Needs edits" },
  { value: "rejected", label: "Rejected" },
];

export const PROGRESS_COLORS: Record<ProgressStatus, string> = {
  none: "bg-slate-100 text-slate-600 ring-slate-200",
  thinking_topic: "bg-amber-100 text-amber-800 ring-amber-200",
  writing_script: "bg-sky-100 text-sky-800 ring-sky-200",
  filming: "bg-violet-100 text-violet-800 ring-violet-200",
  editing: "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200",
  ready_to_post: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  waiting_comment: "bg-rose-100 text-rose-800 ring-rose-200",
};

export const POST_COLORS: Record<PostStatus, string> = {
  none: "bg-slate-100 text-slate-600 ring-slate-200",
  posted: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  not_posted: "bg-rose-100 text-rose-700 ring-rose-200",
  auto_post: "bg-blue-100 text-blue-800 ring-blue-200",
};

export const APPROVAL_COLORS: Record<ApprovalStatus, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  approved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  needs_edits: "bg-orange-100 text-orange-800 ring-orange-200",
  rejected: "bg-rose-100 text-rose-700 ring-rose-200",
};

export const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  manager: "Manager",
  creator: "Creator",
  viewer: "Viewer",
};

export function progressLabel(s: ProgressStatus) {
  return PROGRESS_STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s;
}
export function postLabel(s: PostStatus) {
  return POST_STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s;
}
export function approvalLabel(s: ApprovalStatus) {
  return APPROVAL_STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s;
}
