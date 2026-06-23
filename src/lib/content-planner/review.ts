import type { ActivityLog, ContentTask } from "./types";

export const REVIEW_SUBMITTED_ACTION = "review_submitted";
export const HANDOFF_CLAIMED_ACTION = "handoff_claimed";

export type HandoffPurpose = "edit" | "post";

export interface ReviewSnapshot {
  topic: string;
  caption: string | null;
  creative_brief: string | null;
  note: string | null;
  file_url: string | null;
  content_type: string | null;
  product: string | null;
  platform: string | null;
  scheduled_date: string | null;
  post_time: string | null;
  progress_status: ContentTask["progress_status"];
  approval_status: ContentTask["approval_status"];
  post_status: ContentTask["post_status"];
}

export interface ReviewSubmission {
  id: string;
  task_id: string;
  user_id: string | null;
  created_at: string;
  round: number;
  snapshot: ReviewSnapshot;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createReviewSnapshot(task: ContentTask): ReviewSnapshot {
  return {
    topic: task.topic,
    caption: task.caption,
    creative_brief: task.creative_brief,
    note: task.note,
    file_url: task.file_url,
    content_type: task.content_type,
    product: task.product,
    platform: task.platform,
    scheduled_date: task.scheduled_date,
    post_time: task.post_time,
    progress_status: task.progress_status,
    approval_status: task.approval_status,
    post_status: task.post_status,
  };
}

export function getReviewSubmissions(activity: ActivityLog[]): ReviewSubmission[] {
  return activity
    .filter((item) => item.action === REVIEW_SUBMITTED_ACTION)
    .map((item) => {
      const payload = isRecord(item.new_value) ? item.new_value : {};
      const snapshot = isRecord(payload.snapshot) ? payload.snapshot : null;
      if (!snapshot) return null;

      return {
        id: item.id,
        task_id: item.task_id,
        user_id: item.user_id,
        created_at: item.created_at,
        round: Number(payload.review_round ?? 1),
        snapshot: snapshot as unknown as ReviewSnapshot,
      };
    })
    .filter((item): item is ReviewSubmission => Boolean(item))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getLatestReviewSubmission(activity: ActivityLog[]) {
  return getReviewSubmissions(activity)[0] ?? null;
}

export function getNextReviewRound(activity: ActivityLog[]) {
  return getReviewSubmissions(activity).length + 1;
}
