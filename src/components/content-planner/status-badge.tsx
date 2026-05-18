"use client";
import { Badge } from "@/components/content-planner/ui/badge";
import {
  APPROVAL_COLORS,
  POST_COLORS,
  PROGRESS_COLORS,
} from "@/lib/content-planner/constants";
import {
  useApprovalLabel,
  usePostLabel,
  useProgressLabel,
} from "@/lib/content-planner/i18n";
import type { ApprovalStatus, PostStatus, ProgressStatus } from "@/lib/content-planner/types";

export function ProgressBadge({ value }: { value: ProgressStatus }) {
  const label = useProgressLabel(value);
  return <Badge className={PROGRESS_COLORS[value]}>{label}</Badge>;
}

export function PostBadge({ value }: { value: PostStatus }) {
  const label = usePostLabel(value);
  return <Badge className={POST_COLORS[value]}>{label}</Badge>;
}

export function ApprovalBadge({ value }: { value: ApprovalStatus }) {
  const label = useApprovalLabel(value);
  return <Badge className={APPROVAL_COLORS[value]}>{label}</Badge>;
}

export function ColorTag({ name, color }: { name: string; color?: string | null }) {
  const c = color ?? "#ec4899";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset"
      style={{ background: `${c}1a`, color: c, boxShadow: `inset 0 0 0 1px ${c}40` }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: c }} />
      {name}
    </span>
  );
}
