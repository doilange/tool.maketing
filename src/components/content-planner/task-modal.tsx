"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/content-planner/ui/dialog";
import { Input } from "@/components/content-planner/ui/input";
import { Label } from "@/components/content-planner/ui/label";
import { Textarea } from "@/components/content-planner/ui/textarea";
import { Select } from "@/components/content-planner/ui/select";
import { Button } from "@/components/content-planner/ui/button";
import { dayName, weekGroup } from "@/lib/content-planner/utils";
import type { ContentTask } from "@/lib/content-planner/types";
import { useData } from "@/components/content-planner/data-provider";
import { usePostOptions, useProgressOptions, useT } from "@/lib/content-planner/i18n";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: ContentTask | null;
};

const empty: Partial<ContentTask> = {
  topic: "",
  platform: "",
  product: "",
  content_type: "",
  caption: "",
  creative_brief: "",
  note: "",
  file_url: "",
  posted_url_tiktok: "",
  posted_url_youtube: "",
  posted_url_ig: "",
  posted_url_fb: "",
  progress_status: "none",
  post_status: "not_posted",
  start_date: null,
  due_date: null,
  scheduled_date: null,
  post_time: null,
  workday_status: "workday",
};

export function TaskModal({ open, onOpenChange, task }: Props) {
  const { products, platforms, profiles, me, addTask, updateTask } = useData();
  const t = useT();
  const progressOptions = useProgressOptions();
  const postOptions = usePostOptions();
  const [form, setForm] = React.useState<Partial<ContentTask>>(empty);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      if (task) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm({ ...task });
      } else {
        const today = new Date().toISOString().slice(0, 10);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm({
          ...empty,
          start_date: today,
          due_date: today,
          scheduled_date: today,
          post_time: "18:00",
          owner_id: me?.id ?? null,
        });
      }
      setError(null);
    }
  }, [open, task, me?.id]);

  function set<K extends keyof ContentTask>(k: K, v: ContentTask[K] | null) {
    setForm((f) => ({ ...f, [k]: v as ContentTask[K] }));
  }

  async function save() {
    if (!form.topic) {
      setError(t("modal.topic_required"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const date = form.scheduled_date ? new Date(form.scheduled_date) : null;
      const payload: Partial<ContentTask> = {
        ...form,
        day_name: date ? dayName(date) : null,
        week_group: date ? weekGroup(date) : form.week_group ?? null,
      };
      if (!task) {
        if (!payload.owner_id) payload.owner_id = me?.id ?? null;
        await addTask(payload);
      } else {
        await updateTask(task.id, payload);
      }
      onOpenChange(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{task ? t("modal.edit_task") : t("modal.new_task")}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <Label>{t("modal.topic_label")}</Label>
            <Input
              value={form.topic ?? ""}
              onChange={(e) => set("topic", e.target.value)}
              placeholder={t("modal.topic_placeholder")}
            />
          </div>
          <div>
            <Label>{t("modal.start_date")}</Label>
            <Input
              type="date"
              value={form.start_date ?? ""}
              onChange={(e) => set("start_date", e.target.value || null)}
            />
          </div>
          <div>
            <Label>{t("modal.due_date")}</Label>
            <Input
              type="date"
              value={form.due_date ?? ""}
              min={form.start_date ?? undefined}
              onChange={(e) => set("due_date", e.target.value || null)}
            />
            {form.start_date && form.due_date && form.due_date < form.start_date && (
              <div className="text-[11px] text-rose-600 mt-1">{t("modal.due_before_start")}</div>
            )}
          </div>
          <div>
            <Label>{t("modal.scheduled_date")}</Label>
            <Input
              type="date"
              value={form.scheduled_date ?? ""}
              onChange={(e) => set("scheduled_date", e.target.value || null)}
            />
          </div>
          <div>
            <Label>{t("modal.post_time")}</Label>
            <Input
              type="time"
              value={form.post_time ?? ""}
              onChange={(e) => set("post_time", e.target.value || null)}
            />
          </div>
          <div>
            <Label>{t("modal.platform")}</Label>
            <Select
              value={form.platform ?? ""}
              onChange={(e) => set("platform", e.target.value || null)}
            >
              <option value="">—</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t("modal.product")}</Label>
            <Select
              value={form.product ?? ""}
              onChange={(e) => set("product", e.target.value || null)}
            >
              <option value="">—</option>
              {products.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t("modal.content_type")}</Label>
            <Select
              value={form.content_type ?? ""}
              onChange={(e) => set("content_type", e.target.value || null)}
            >
              <option value="">—</option>
              <option value="vdo">{t("content_type.vdo")}</option>
              <option value="image">{t("content_type.image")}</option>
              <option value="image/vdo">{t("content_type.image_vdo")}</option>
              <option value="บทความ">{t("content_type.article")}</option>
              <option value="Reels">Reels</option>
              <option value="Carousel">Carousel</option>
              <option value="Single Image">Single Image</option>
              <option value="Live">Live</option>
              <option value="Broadcast">Broadcast</option>
            </Select>
          </div>
          <div>
            <Label>{t("modal.owner")}</Label>
            <Select
              value={form.owner_id ?? ""}
              onChange={(e) => set("owner_id", e.target.value || null)}
            >
              <option value="">—</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name ?? p.id.slice(0, 6)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t("modal.progress_status")}</Label>
            <Select
              value={form.progress_status ?? "none"}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => set("progress_status", e.target.value as any)}
            >
              {progressOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t("modal.post_status")}</Label>
            <Select
              value={form.post_status ?? "not_posted"}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => set("post_status", e.target.value as any)}
            >
              {postOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t("modal.workday")}</Label>
            <Select
              value={form.workday_status ?? "workday"}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => set("workday_status", e.target.value as any)}
            >
              <option value="workday">{t("modal.workday_workday")}</option>
              <option value="dayoff">{t("modal.workday_dayoff")}</option>
              <option value="holiday">{t("modal.workday_holiday")}</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>{t("modal.file_url")}</Label>
            <Input
              value={form.file_url ?? ""}
              onChange={(e) => set("file_url", e.target.value || null)}
              placeholder="https://drive.google.com/…"
            />
          </div>
          <div className="md:col-span-2">
            <div className="text-xs font-semibold text-slate-700 mb-2 mt-1">
              {t("modal.posted_urls")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-black" /> TikTok
                </Label>
                <Input
                  value={form.posted_url_tiktok ?? ""}
                  onChange={(e) => set("posted_url_tiktok", e.target.value || null)}
                  placeholder="https://www.tiktok.com/@…"
                />
              </div>
              <div>
                <Label className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-600" /> YouTube
                </Label>
                <Input
                  value={form.posted_url_youtube ?? ""}
                  onChange={(e) => set("posted_url_youtube", e.target.value || null)}
                  placeholder="https://youtube.com/…"
                />
              </div>
              <div>
                <Label className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-pink-500" /> Instagram
                </Label>
                <Input
                  value={form.posted_url_ig ?? ""}
                  onChange={(e) => set("posted_url_ig", e.target.value || null)}
                  placeholder="https://instagram.com/p/…"
                />
              </div>
              <div>
                <Label className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-600" /> Facebook
                </Label>
                <Input
                  value={form.posted_url_fb ?? ""}
                  onChange={(e) => set("posted_url_fb", e.target.value || null)}
                  placeholder="https://facebook.com/…"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <Label>{t("modal.caption")}</Label>
            <Textarea
              value={form.caption ?? ""}
              onChange={(e) => set("caption", e.target.value || null)}
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <Label>{t("modal.creative_brief")}</Label>
            <Textarea
              value={form.creative_brief ?? ""}
              onChange={(e) => set("creative_brief", e.target.value || null)}
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <Label>{t("modal.note")}</Label>
            <Textarea
              value={form.note ?? ""}
              onChange={(e) => set("note", e.target.value || null)}
              rows={2}
            />
          </div>
        </div>
        {error && (
          <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2">
            {error}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? t("modal.saving") : task ? t("modal.save") : t("modal.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
