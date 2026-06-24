"use client";
import * as React from "react";
import { AssetCarousel } from "@/components/content-planner/asset-carousel";
import { useData } from "@/components/content-planner/data-provider";
import { TaskDetailModal } from "@/components/content-planner/task-detail-modal";
import { Button } from "@/components/content-planner/ui/button";
import { Card, CardContent } from "@/components/content-planner/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/content-planner/ui/dialog";
import { Textarea } from "@/components/content-planner/ui/textarea";
import {
  ApprovalBadge,
  ColorTag,
  PostBadge,
  ProgressBadge,
} from "@/components/content-planner/status-badge";
import { useT } from "@/lib/content-planner/i18n";
import { extractContentAssets } from "@/lib/content-planner/assets";
import { formatDate, formatDateTime, initials } from "@/lib/content-planner/utils";
import { getLatestReviewSubmission } from "@/lib/content-planner/review";
import type { ContentTask } from "@/lib/content-planner/types";
import {
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  Loader2,
  RefreshCcw,
} from "lucide-react";

type ReviewFilter = "all" | "pending" | "needs_edits" | "approved" | "ready_post";

const FILTERS: { key: ReviewFilter; labelKey: string }[] = [
  { key: "pending", labelKey: "review.pending" },
  { key: "needs_edits", labelKey: "review.needs_edits" },
  { key: "ready_post", labelKey: "review.ready_post" },
  { key: "approved", labelKey: "review.approved" },
  { key: "all", labelKey: "review.all" },
];

export default function ReviewPage() {
  const {
    tasks,
    profiles,
    products,
    platforms,
    activity,
    me,
    addComment,
    setApproval,
  } = useData();
  const t = useT();
  const [filter, setFilter] = React.useState<ReviewFilter>("pending");
  const [detail, setDetail] = React.useState<ContentTask | null>(null);
  const [feedbackTaskId, setFeedbackTaskId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState("");
  const [actionTaskId, setActionTaskId] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<{ taskId: string; message: string } | null>(
    null
  );
  const isManager = me?.role === "admin" || me?.role === "manager";

  async function approveTask(taskId: string) {
    if (actionTaskId) return;
    setActionTaskId(taskId);
    setActionError(null);
    try {
      await setApproval(taskId, "approved", "ready_to_post");
    } catch (error) {
      setActionError({
        taskId,
        message: error instanceof Error ? error.message : t("planner.update_failed"),
      });
    } finally {
      setActionTaskId(null);
    }
  }

  async function requestTaskEdits(taskId: string) {
    const message = feedback.trim();
    if (actionTaskId) return;
    setActionTaskId(taskId);
    setActionError(null);
    try {
      await setApproval(taskId, "needs_edits", "editing");
      if (message) {
        await addComment(taskId, message);
      }
      setFeedback("");
      setFeedbackTaskId(null);
    } catch (error) {
      setActionError({
        taskId,
        message: error instanceof Error ? error.message : t("planner.update_failed"),
      });
    } finally {
      setActionTaskId(null);
    }
  }

  function openFeedback(taskId: string) {
    setFeedbackTaskId(taskId);
    setFeedback("");
    setActionError(null);
  }

  function closeFeedback() {
    if (actionTaskId) return;
    setFeedbackTaskId(null);
    setFeedback("");
    setActionError(null);
  }

  const taskActivity = React.useMemo(() => {
    const map = new Map<string, typeof activity>();
    activity.forEach((item) => {
      const rows = map.get(item.task_id) ?? [];
      rows.push(item);
      map.set(item.task_id, rows);
    });
    return map;
  }, [activity]);

  const reviewTasks = React.useMemo(
    () =>
      tasks
        .filter((task) => isReviewTask(task))
        .filter((task) => filter === "all" || getReviewFilter(task) === filter)
        .sort(sortReviewTasks),
    [filter, tasks]
  );

  const stats = React.useMemo(
    () => ({
      pending: tasks.filter((task) => getReviewFilter(task) === "pending").length,
      needsEdits: tasks.filter((task) => getReviewFilter(task) === "needs_edits").length,
      approved: tasks.filter((task) => getReviewFilter(task) === "approved").length,
      readyPost: tasks.filter((task) => getReviewFilter(task) === "ready_post").length,
    }),
    [tasks]
  );
  const feedbackTask = React.useMemo(
    () => tasks.find((task) => task.id === feedbackTaskId) ?? null,
    [feedbackTaskId, tasks]
  );
  const feedbackError =
    feedbackTaskId && actionError?.taskId === feedbackTaskId ? actionError.message : null;
  const isFeedbackSaving = feedbackTaskId !== null && actionTaskId === feedbackTaskId;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 select-none">
            {t("review.title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("review.subtitle")}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <QueueStat icon={<Clock3 className="h-4 w-4" />} label={t("review.pending")} value={stats.pending} />
          <QueueStat icon={<RefreshCcw className="h-4 w-4" />} label={t("review.needs_edits")} value={stats.needsEdits} />
          <QueueStat icon={<FileCheck2 className="h-4 w-4" />} label={t("review.ready_post")} value={stats.readyPost} />
          <QueueStat icon={<CheckCircle2 className="h-4 w-4" />} label={t("review.approved")} value={stats.approved} />
        </div>
      </div>

      <Card>
        <CardContent className="flex gap-1 overflow-x-auto p-2">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`min-h-9 shrink-0 rounded-md px-3 text-xs font-bold transition-colors cursor-pointer ${
                filter === item.key
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-white/10"
              }`}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </CardContent>
      </Card>

      {reviewTasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {t("review.empty")}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {reviewTasks.map((task) => {
            const rows = taskActivity.get(task.id) ?? [];
            const submission = getLatestReviewSubmission(rows);
            const submitter = submission
              ? profiles.find((profile) => profile.id === submission.user_id)
              : null;
            const owner = profiles.find((profile) => profile.id === task.owner_id);
            const product = products.find((item) => item.name === task.product);
            const platform = platforms.find((item) => item.name === task.platform);
            const snapshot = submission?.snapshot;
            const assets = extractContentAssets(snapshot?.file_url, task.file_url);
            const canReviewInline =
              isManager &&
              task.approval_status === "pending" &&
              task.progress_status === "waiting_comment";
            const isSaving = actionTaskId === task.id;
            const taskError = actionError?.taskId === task.id ? actionError.message : null;

            return (
              <article
                key={task.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]"
              >
                <AssetCarousel
                  assets={assets}
                  emptyText={t("review.no_assets")}
                  openLabel={t("common.open")}
                  downloadLabel={t("common.download")}
                  downloadingLabel={t("common.downloading")}
                  unavailableText={t("common.preview_unavailable")}
                  compact
                />

                <div className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <ProgressBadge value={task.progress_status} />
                        <ApprovalBadge value={task.approval_status} />
                        <PostBadge value={task.post_status} />
                        {product && <ColorTag name={product.name} color={product.color} />}
                        {platform && <ColorTag name={platform.name} color={platform.color} />}
                      </div>
                      <h2 className="mt-2 line-clamp-2 text-base font-extrabold leading-snug text-slate-950 dark:text-slate-50">
                        {task.topic}
                      </h2>
                    </div>
                    <div className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-right text-xs dark:border-white/10">
                      <div className="font-bold text-violet-700 dark:text-violet-300">
                        {formatDate(task.scheduled_date)}
                      </div>
                      <div className="mt-0.5 text-muted-foreground">{task.post_time?.slice(0, 5) ?? "—"}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 border-t border-slate-100 pt-3 text-xs text-muted-foreground dark:border-white/10 sm:grid-cols-3">
                    <Meta label={t("table.owner")} value={owner?.full_name ?? "—"} />
                    <Meta label={t("table.type")} value={task.content_type ?? "—"} />
                    <Meta label={t("table.updated")} value={formatDateTime(task.updated_at)} />
                  </div>

                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-white/5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-extrabold text-foreground">
                        {t("review.latest_submission")}
                      </div>
                      {submission && (
                        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 ring-1 ring-inset ring-violet-200 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-400/20">
                          {t("review.round", { n: submission.round })}
                        </span>
                      )}
                    </div>

                    {submission && snapshot ? (
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="grid h-6 w-6 place-items-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">
                          {initials(submitter?.full_name)}
                        </div>
                        <span className="min-w-0 truncate">
                          {t("review.submitted_by", { name: submitter?.full_name ?? "System" })} ·{" "}
                          {formatDateTime(submission.created_at)}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-muted-foreground">{t("review.no_submission")}</div>
                    )}
                  </div>

                  {canReviewInline && (
                    <div className="mt-4 border-t border-slate-100 pt-4 dark:border-white/10">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-extrabold text-foreground">
                            {t("review.manager_decision")}
                          </div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground">
                            {t("review.manager_decision_hint")}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700 ring-1 ring-inset ring-violet-200 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-400/20">
                          {t("review.manager_only")}
                        </span>
                      </div>

                      {taskError && (
                        <div
                          role="alert"
                          className="mb-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
                        >
                          {taskError}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isSaving || actionTaskId !== null}
                          onClick={() => openFeedback(task.id)}
                        >
                          <RefreshCcw className="h-3.5 w-3.5" />
                          {t("detail.request_edits")}
                        </Button>
                        <Button
                          size="sm"
                          disabled={isSaving || actionTaskId !== null}
                          onClick={() => void approveTask(task.id)}
                        >
                          {isSaving ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          {isSaving ? t("detail.approving") : t("detail.approve")}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    {assets[0] && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={assets[0].originalUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" /> {t("detail.field.file")}
                        </a>
                      </Button>
                    )}
                    <Button size="sm" onClick={() => setDetail(task)}>
                      {t("review.open_detail")}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={feedbackTaskId !== null} onOpenChange={(open) => !open && closeFeedback()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("review.request_edits_title")}</DialogTitle>
            <DialogDescription>{t("review.request_edits_description")}</DialogDescription>
          </DialogHeader>
          {feedbackTask && (
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm font-bold leading-snug text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-50">
              {feedbackTask.topic}
            </div>
          )}
          <div>
            <div className="mb-1 text-xs font-bold text-foreground">
              {t("review.optional_feedback")}
            </div>
            <Textarea
              rows={4}
              autoFocus
              value={feedback}
              disabled={isFeedbackSaving}
              onChange={(event) => {
                setFeedback(event.target.value);
                if (feedbackError) setActionError(null);
              }}
              placeholder={t("detail.review_feedback_placeholder")}
              className="min-h-[120px] resize-y"
            />
            <p className="mt-2 text-xs text-muted-foreground">{t("review.optional_feedback_hint")}</p>
          </div>
          {feedbackError && (
            <div
              role="alert"
              className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
            >
              {feedbackError}
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" disabled={isFeedbackSaving} onClick={closeFeedback}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="outline"
              disabled={!feedbackTaskId || isFeedbackSaving}
              onClick={() => feedbackTaskId && void requestTaskEdits(feedbackTaskId)}
            >
              {isFeedbackSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              {isFeedbackSaving ? t("detail.approving") : t("review.confirm_request_edits")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TaskDetailModal open={!!detail} onOpenChange={(open) => !open && setDetail(null)} task={detail} />
    </div>
  );
}

function isReviewTask(task: ContentTask) {
  const state = getReviewFilter(task);
  return state !== "all";
}

function getReviewFilter(task: ContentTask): ReviewFilter {
  if (task.approval_status === "needs_edits") return "needs_edits";
  if (task.approval_status === "approved" && task.post_status !== "posted") return "ready_post";
  if (task.approval_status === "approved") return "approved";
  if (
    task.approval_status === "pending" &&
    ["waiting_comment", "ready_to_post"].includes(task.progress_status)
  ) {
    return "pending";
  }
  if (task.approval_status === "rejected") return "needs_edits";
  return "all";
}

function sortReviewTasks(a: ContentTask, b: ContentTask) {
  const priority = {
    pending: 0,
    needs_edits: 1,
    ready_post: 2,
    approved: 3,
    all: 4,
  } satisfies Record<ReviewFilter, number>;
  const byPriority = priority[getReviewFilter(a)] - priority[getReviewFilter(b)];
  if (byPriority !== 0) return byPriority;
  return (a.scheduled_date ?? "9999-99-99").localeCompare(b.scheduled_date ?? "9999-99-99");
}

function QueueStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-white/10 dark:bg-[#111827]">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-1 text-xl font-extrabold leading-none text-foreground">{value}</div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate font-semibold text-foreground">{value}</div>
    </div>
  );
}
