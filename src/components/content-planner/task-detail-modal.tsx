"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/content-planner/ui/dialog";
import { Button } from "@/components/content-planner/ui/button";
import { Textarea } from "@/components/content-planner/ui/textarea";
import { Select } from "@/components/content-planner/ui/select";
import { Badge } from "@/components/content-planner/ui/badge";
import { usePostOptions, useProgressOptions, useT } from "@/lib/content-planner/i18n";
import {
  ApprovalBadge,
  ColorTag,
  PostBadge,
  ProgressBadge,
} from "./status-badge";
import { useData } from "@/components/content-planner/data-provider";
import {
  ApprovalStatus,
  ContentTask,
  ProgressStatus,
} from "@/lib/content-planner/types";
import { formatDate, formatDateTime, initials } from "@/lib/content-planner/utils";
import { Check, MessageCircle, X, RefreshCcw, Activity, ExternalLink } from "lucide-react";

export function TaskDetailModal({
  open,
  onOpenChange,
  task,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  task: ContentTask | null;
}) {
  const { profiles, products, platforms, comments, activity, me, addComment, setApproval, updateTask } = useData();
  const t = useT();
  const progressOptions = useProgressOptions();
  const postOptions = usePostOptions();
  const [text, setText] = React.useState("");
  const [posting, setPosting] = React.useState(false);

  const taskComments = React.useMemo(
    () => comments.filter((c) => task && c.task_id === task.id),
    [comments, task]
  );
  const taskActivity = React.useMemo(
    () => activity.filter((a) => task && a.task_id === task.id),
    [activity, task]
  );

  if (!task) return null;

  const owner = profiles.find((p) => p.id === task.owner_id);
  const product = products.find((p) => p.name === task.product);
  const platform = platforms.find((p) => p.name === task.platform);
  const isManager = me?.role === "admin" || me?.role === "manager";

  async function postComment() {
    if (!text.trim() || !me || !task) return;
    setPosting(true);
    await addComment(task.id, text.trim());
    setText("");
    setPosting(false);
  }

  async function approveAs(value: ApprovalStatus, progress?: ProgressStatus) {
    if (!me || !task) return;
    await setApproval(task.id, value, progress);
  }

  const canEdit = me?.role !== "viewer";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="pr-8 leading-tight">{task.topic}</DialogTitle>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <ProgressBadge value={task.progress_status} />
            <PostBadge value={task.post_status} />
            <ApprovalBadge value={task.approval_status} />
            {platform && <ColorTag name={platform.name} color={platform.color} />}
            {product && <ColorTag name={product.name} color={product.color} />}
            {task.content_type && (
              <Badge className="bg-slate-100 text-slate-700 ring-slate-200">
                {task.content_type}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <Field label={t("detail.field.start_date")} value={formatDate(task.start_date)} />
              <Field label={t("detail.field.due_date")} value={formatDate(task.due_date)} />
              <Field label={t("detail.field.date")} value={formatDate(task.scheduled_date)} />
              <Field label={t("detail.field.day")} value={task.day_name ?? "—"} />
              <Field label={t("detail.field.post_time")} value={task.post_time?.slice(0, 5) ?? "—"} />
              <Field label={t("detail.field.week")} value={task.week_group ?? "—"} />
              <Field label={t("detail.field.owner")} value={owner?.full_name ?? "—"} />
              <Field label={t("detail.field.workday")} value={task.workday_status} />
              <Field label={t("detail.field.last_updated")} value={formatDateTime(task.updated_at)} />
              <Field
                label={t("detail.field.file")}
                value={
                  task.file_url ? (
                    <a
                      className="text-violet-600 hover:underline inline-flex items-center gap-1"
                      href={task.file_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("common.open")} <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
            </div>

            {(task.posted_url_tiktok || task.posted_url_youtube || task.posted_url_ig || task.posted_url_fb) && (
              <Section title={t("detail.section.posted_urls")}>
                <div className="flex flex-wrap gap-2">
                  {task.posted_url_tiktok && (
                    <PostedLink href={task.posted_url_tiktok} label="TikTok" dotClass="bg-black" />
                  )}
                  {task.posted_url_youtube && (
                    <PostedLink href={task.posted_url_youtube} label="YouTube" dotClass="bg-red-600" />
                  )}
                  {task.posted_url_ig && (
                    <PostedLink href={task.posted_url_ig} label="Instagram" dotClass="bg-pink-500" />
                  )}
                  {task.posted_url_fb && (
                    <PostedLink href={task.posted_url_fb} label="Facebook" dotClass="bg-blue-600" />
                  )}
                </div>
              </Section>
            )}

            <Section title={t("detail.section.caption")}>
              <p className="whitespace-pre-wrap text-sm text-slate-700">
                {task.caption || <span className="text-slate-400">{t("detail.no_caption")}</span>}
              </p>
            </Section>
            <Section title={t("detail.section.brief")}>
              <p className="whitespace-pre-wrap text-sm text-slate-700">
                {task.creative_brief || (
                  <span className="text-slate-400">{t("detail.no_brief")}</span>
                )}
              </p>
            </Section>
            {task.note && (
              <Section title={t("detail.section.note")}>
                <p className="whitespace-pre-wrap text-sm text-slate-700">{task.note}</p>
              </Section>
            )}

            <Section
              title={
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" /> {t("detail.comments")} ({taskComments.length})
                </span>
              }
            >
              <div className="space-y-3">
                {taskComments.length === 0 && (
                  <div className="text-xs text-slate-400">{t("detail.be_first")}</div>
                )}
                {taskComments.map((c) => {
                  const author = profiles.find((p) => p.id === c.user_id);
                  return (
                    <div key={c.id} className="flex gap-2">
                      <div className="h-7 w-7 rounded-full bg-pink-gradient-strong text-white grid place-items-center text-[10px] font-semibold shrink-0">
                        {initials(author?.full_name)}
                      </div>
                      <div className="flex-1 bg-violet-50/50 border border-violet-100 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">
                            {author?.full_name ?? "Unknown"}
                          </span>
                          <span>·</span>
                          <span>{formatDateTime(c.created_at)}</span>
                        </div>
                        <div className="text-sm text-slate-700 whitespace-pre-wrap">{c.comment}</div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex gap-2 pt-2">
                  <Textarea
                    rows={2}
                    placeholder={t("detail.write_comment")}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <Button onClick={postComment} disabled={posting || !text.trim()}>
                    {t("common.send")}
                  </Button>
                </div>
              </div>
            </Section>
          </div>

          <div className="space-y-4">
            <Section title={t("detail.status")}>
              {canEdit ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-1">
                      {t("detail.progress")}
                    </div>
                    <Select
                      value={task.progress_status}
                      onChange={(e) =>
                        updateTask(task.id, {
                          progress_status: e.target.value as ProgressStatus,
                        })
                      }
                    >
                      {progressOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-1">
                      {t("detail.post_status")}
                    </div>
                    <Select
                      value={task.post_status}
                      onChange={(e) =>
                        updateTask(task.id, {
                          post_status: e.target.value as ContentTask["post_status"],
                        })
                      }
                    >
                      {postOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  {t("detail.no_permission_status")}
                </div>
              )}
            </Section>

            <Section
              title={
                <span className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4" /> {t("detail.approval")}
                </span>
              }
            >
              {isManager ? (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="default"
                    onClick={() => approveAs("approved", "ready_to_post")}
                  >
                    <Check className="h-4 w-4" /> {t("detail.approve")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => approveAs("needs_edits", "editing")}
                  >
                    <RefreshCcw className="h-4 w-4" /> {t("detail.request_edits")}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => approveAs("rejected", "none")}
                  >
                    <X className="h-4 w-4" /> {t("detail.reject")}
                  </Button>
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  {t("detail.no_permission_approval")}
                </div>
              )}
            </Section>

            <Section
              title={
                <span className="inline-flex items-center gap-2">
                  <Activity className="h-4 w-4" /> {t("detail.activity")}
                </span>
              }
            >
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {taskActivity.length === 0 && (
                  <div className="text-xs text-slate-400">{t("detail.no_activity")}</div>
                )}
                {taskActivity.map((a) => {
                  const author = profiles.find((p) => p.id === a.user_id);
                  return (
                    <div key={a.id} className="text-xs flex gap-2">
                      <div className="h-5 w-5 rounded-full bg-violet-100 text-violet-700 grid place-items-center text-[9px] font-bold shrink-0">
                        {initials(author?.full_name)}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-slate-700">
                          {author?.full_name ?? "System"}
                        </span>{" "}
                        <span className="text-slate-500">{a.action}</span>
                        <div className="text-[10px] text-slate-400">
                          {formatDateTime(a.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
        {label}
      </div>
      <div className="text-slate-700">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-violet-100 bg-white/70 p-4">
      <div className="text-sm font-semibold text-slate-800 mb-2">{title}</div>
      {children}
    </div>
  );
}

function PostedLink({
  href,
  label,
  dotClass,
}: {
  href: string;
  label: string;
  dotClass: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-violet-50 hover:border-violet-300 transition-colors"
    >
      <span className={`inline-block h-2 w-2 rounded-full ${dotClass}`} />
      {label}
      <ExternalLink className="h-3 w-3 text-slate-400" />
    </a>
  );
}
