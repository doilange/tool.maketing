export type UserRole = "admin" | "manager" | "creator" | "viewer";

export type ProgressStatus =
  | "none"
  | "thinking_topic"
  | "writing_script"
  | "filming"
  | "editing"
  | "ready_to_post"
  | "waiting_comment";

export type PostStatus = "none" | "posted" | "not_posted" | "auto_post";

export type ApprovalStatus = "pending" | "approved" | "needs_edits" | "rejected";

export type WorkdayStatus = "workday" | "dayoff" | "holiday";

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Platform {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface ContentTask {
  id: string;
  week_group: string | null;
  start_date: string | null;
  due_date: string | null;
  scheduled_date: string | null;
  day_name: string | null;
  post_time: string | null;
  workday_status: WorkdayStatus;
  platform: string | null;
  product: string | null;
  topic: string;
  content_type: string | null;
  progress_status: ProgressStatus;
  post_status: PostStatus;
  owner_id: string | null;
  caption: string | null;
  creative_brief: string | null;
  file_url: string | null;
  posted_url_tiktok: string | null;
  posted_url_youtube: string | null;
  posted_url_ig: string | null;
  posted_url_fb: string | null;
  note: string | null;
  approval_status: ApprovalStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  task_id: string;
  user_id: string | null;
  action: string;
  old_value: unknown;
  new_value: unknown;
  created_at: string;
}
