"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/content-planner/ui/dialog";
import { Button } from "@/components/content-planner/ui/button";
import { useData } from "@/components/content-planner/data-provider";
import { useT } from "@/lib/content-planner/i18n";
import {
  ApprovalBadge,
  ColorTag,
  PostBadge,
  ProgressBadge,
} from "./status-badge";
import {
  CheckCircle2,
  Sparkles,
  Calendar,
  Layers,
  Check,
  Loader2,
  BellRing,
} from "lucide-react";
import type { ContentTask } from "@/lib/content-planner/types";

interface SmartReminderModalProps {
  onSelectTask: (task: ContentTask) => void;
}

export function SmartReminderModal({ onSelectTask }: SmartReminderModalProps) {
  const { tasks, profiles, products, platforms, me, setApproval } = useData();
  const t = useT();

  const [open, setOpen] = React.useState(false);
  const [snooze, setSnooze] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<ContentTask | null>(null);

  const today = React.useMemo(() => new Date().toISOString().slice(0, 10), []);

  // 1. Scoring Algorithm to identify highest priority task
  const getPriorityScore = React.useCallback((task: ContentTask) => {
    let score = 0;
    
    // Urgency Score (max 100)
    if (task.scheduled_date) {
      const diffMs = new Date(task.scheduled_date).getTime() - new Date(today).getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) {
        score += 100;
      } else if (diffDays === 1) {
        score += 75;
      } else if (diffDays <= 3) {
        score += 50;
      } else if (diffDays <= 7) {
        score += 25;
      } else {
        score += 10;
      }
    } else {
      score += 10;
    }

    // Speed / Type Bonus (max 30)
    const type = task.content_type?.toLowerCase() || "";
    if (["image", "single image", "carousel"].includes(type)) {
      score += 30;
    } else if (["บทความ", "broadcast", "article"].includes(type)) {
      score += 15;
    }

    // Progress Bonus (max 25)
    const progress = task.progress_status;
    if (["waiting_comment", "editing"].includes(progress)) {
      score += 25;
    } else if (["filming", "writing_script"].includes(progress)) {
      score += 15;
    }

    return score;
  }, [today]);

  // Helper to retrieve recommended task based on user role and priorities
  const getRecommendedTask = React.useCallback(() => {
    if (!me || tasks.length === 0) return null;

    if (me.role === "creator") {
      const creatorTasks = tasks.filter(
        (task) => task.owner_id === me.id && task.post_status !== "posted"
      );
      if (creatorTasks.length > 0) {
        return [...creatorTasks].sort(
          (a, b) => getPriorityScore(b) - getPriorityScore(a)
        )[0];
      }
    } else if (me.role === "admin" || me.role === "manager") {
      const pendingTasks = tasks.filter(
        (task) => task.progress_status === "waiting_comment" && task.post_status !== "posted"
      );
      if (pendingTasks.length > 0) {
        return [...pendingTasks].sort((a, b) => {
          const dateA = a.scheduled_date || "";
          const dateB = b.scheduled_date || "";
          if (dateA !== dateB) return dateA.localeCompare(dateB);
          return getPriorityScore(b) - getPriorityScore(a);
        })[0];
      }
    }
    return null;
  }, [me, tasks, getPriorityScore]);

  // Check if reminder is in 3-hour or 15-minute cooldown, or bypass if task is newly updated
  const shouldShowPopup = React.useCallback((recommended: ContentTask | null) => {
    if (!me || !recommended) return false;

    const lastActionedStr = localStorage.getItem(`cp_reminder_last_actioned_${me.id}`);
    if (!lastActionedStr) return true;

    const lastActioned = Number(lastActionedStr);
    if (isNaN(lastActioned)) return true;

    // Bypass cooldown if the recommended task was updated AFTER the popup was last dismissed
    if (recommended.updated_at) {
      const taskUpdated = new Date(recommended.updated_at).getTime();
      if (taskUpdated > lastActioned) {
        return true;
      }
    }

    const wasSnoozedChecked = localStorage.getItem(`cp_reminder_snooze_checked_${me.id}`) !== "false";
    const cooldown = wasSnoozedChecked ? 3 * 60 * 60 * 1000 : 15 * 60 * 1000;

    return Date.now() - lastActioned >= cooldown;
  }, [me]);

  // Set action / snooze state on dismissal or CTA click
  const recordAction = React.useCallback(() => {
    if (!me) return;
    localStorage.setItem(`cp_reminder_last_actioned_${me.id}`, String(Date.now()));
    localStorage.setItem(`cp_reminder_snooze_checked_${me.id}`, String(snooze));
  }, [me, snooze]);

  // Periodic active background timer (runs checks on load & every 30 seconds)
  React.useEffect(() => {
    if (!me || tasks.length === 0) return;

    const checkAndTrigger = () => {
      // Do not trigger if modal is currently open or success animation is playing
      if (open || success) return;

      const recommended = getRecommendedTask();
      if (shouldShowPopup(recommended)) {
        if (recommended) {
          setSelectedTask(recommended);
          setSuccess(false);
          setOpen(true);
        }
      }
    };

    checkAndTrigger();

    const interval = setInterval(checkAndTrigger, 30000);
    return () => clearInterval(interval);
  }, [me, tasks, open, success, shouldShowPopup, getRecommendedTask]);

  if (!selectedTask || !me) return null;

  const score = getPriorityScore(selectedTask);
  const isManager = me.role === "admin" || me.role === "manager";
  
  const product = products.find((p) => p.name === selectedTask.product);
  const platform = platforms.find((p) => p.name === selectedTask.platform);
  const owner = profiles.find((p) => p.id === selectedTask.owner_id);

  function getPriorityBadge(score: number) {
    if (score >= 130) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-rose-500/10 text-rose-500 ring-1 ring-inset ring-rose-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)] animate-pulse-soft select-none whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
          {t("priority.critical")}
        </span>
      );
    }
    if (score >= 100) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-500/10 text-amber-500 ring-1 ring-inset ring-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.15)] select-none whitespace-nowrap">
          {t("priority.quick_urgent")}
        </span>
      );
    }
    if (score >= 70) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20 select-none whitespace-nowrap">
          {t("priority.quick_win")}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold bg-white/20 dark:bg-white/5 text-muted-foreground ring-1 ring-inset ring-white/10 select-none whitespace-nowrap">
        {t("priority.scheduled")}
      </span>
    );
  }

  // Dismiss modal and handle daily snooze
  const handleDismiss = () => {
    recordAction();
    setOpen(false);
  };

  // Perform instant approval for managers
  const handleApproveInstant = async () => {
    setLoading(true);
    try {
      await setApproval(selectedTask.id, "approved");
      setSuccess(true);
      recordAction();
      // Auto-close after short delay to let success animation play
      setTimeout(() => {
        setOpen(false);
      }, 1200);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Open full details view
  const handleViewDetails = () => {
    recordAction();
    setOpen(false);
    onSelectTask(selectedTask);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleDismiss()}>
      <DialogContent className="max-w-xl border border-white/20 dark:border-white/5 bg-white/90 dark:bg-[#0e1324]/90 backdrop-blur-3xl shadow-[0_20px_50px_rgba(109,40,217,0.15)] rounded-3xl p-7 text-foreground overflow-hidden">
        {success ? (
          <div className="py-10 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
              <CheckCircle2 className="h-20 w-20 text-emerald-500 relative z-10 animate-bounce-soft" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1 select-none">
              {t("reminder.success_approve")}
            </h3>
            <p className="text-sm text-muted-foreground select-none">
              {selectedTask.topic}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <DialogHeader className="flex flex-row items-start gap-4">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white grid place-items-center shadow-lg shadow-violet-500/20 shrink-0">
                <BellRing className="h-5 w-5 animate-pulse-soft" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-lg font-extrabold bg-clip-text text-transparent bg-brand-gradient tracking-tight leading-none pr-8">
                  {isManager ? t("reminder.title_manager") : t("reminder.title_creator")}
                </DialogTitle>
                <p className="text-xs text-muted-foreground pr-8 leading-relaxed">
                  {isManager ? t("reminder.subtitle_manager") : t("reminder.subtitle_creator")}
                </p>
              </div>
            </DialogHeader>

            {/* Glowing Frosted Glass Task Card */}
            <div className="relative p-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/15 dark:border-white/5 shadow-inner hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-0 h-24 w-24 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {getPriorityBadge(score)}
                  </div>
                  {selectedTask.scheduled_date && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground/80 bg-white/20 dark:bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                      <Calendar className="h-3 w-3 text-violet-500" />
                      {new Date(selectedTask.scheduled_date).toLocaleDateString(
                        t("common.language") === "th" ? "th-TH" : "en-US",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                      {selectedTask.post_time && ` • ${selectedTask.post_time.slice(0, 5)}`}
                    </div>
                  )}
                </div>

                <div className="text-base font-extrabold text-foreground tracking-tight leading-tight">
                  {selectedTask.topic}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-violet-100/5 dark:border-white/5">
                  {platform && <ColorTag name={platform.name} color={platform.color} />}
                  {product && <ColorTag name={product.name} color={product.color} />}
                  <ProgressBadge value={selectedTask.progress_status} />
                  <PostBadge value={selectedTask.post_status} />
                  <ApprovalBadge value={selectedTask.approval_status} />
                </div>

                {/* Additional metadata info inside card */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-muted-foreground/60">{t("table.owner")}:</span>
                    <span className="font-semibold text-foreground/80">{owner?.full_name || t("common.guest")}</span>
                  </div>
                  {selectedTask.content_type && (
                    <div className="flex items-center gap-1">
                      <Layers className="h-3 w-3 text-fuchsia-500" />
                      <span className="font-semibold text-foreground/80">{selectedTask.content_type}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Snooze Checkbox Control */}
            <div className="flex items-center gap-2.5 p-1 select-none">
              <input
                type="checkbox"
                id="snooze-reminder"
                checked={snooze}
                onChange={(e) => setSnooze(e.target.checked)}
                className="h-4.5 w-4.5 rounded-lg border border-white/20 dark:border-white/10 accent-violet-600 bg-white/20 dark:bg-white/5 cursor-pointer focus:ring-2 focus:ring-violet-500/50 transition-all"
              />
              <label
                htmlFor="snooze-reminder"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {t("reminder.checkbox_snooze")}
              </label>
            </div>

            {/* Premium CTA Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2 border-t border-violet-100/10 dark:border-white/5">
              {isManager ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={handleDismiss}
                    className="order-3 sm:order-1 text-muted-foreground hover:text-foreground cursor-pointer font-bold text-xs py-2 px-4 rounded-xl border border-transparent hover:border-white/10 active:scale-[0.98] transition-transform select-none"
                  >
                    {t("reminder.button_later")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleViewDetails}
                    className="order-2 sm:order-2 bg-white/10 dark:bg-white/5 border border-white/15 dark:border-white/5 hover:bg-white/15 dark:hover:bg-white/10 cursor-pointer font-bold text-xs py-2 px-4 rounded-xl active:scale-[0.98] transition-transform select-none"
                  >
                    {t("reminder.button_review_detail")}
                  </Button>
                  <Button
                    onClick={handleApproveInstant}
                    disabled={loading}
                    className="order-1 sm:order-3 bg-brand-gradient text-white shadow-lg shadow-violet-500/20 font-bold text-xs py-2 px-4 rounded-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5 shrink-0 cursor-pointer select-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{t("modal.saving")}</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>{t("reminder.button_approve_instant")}</span>
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={handleDismiss}
                    className="order-2 sm:order-1 text-muted-foreground hover:text-foreground cursor-pointer font-bold text-xs py-2 px-4 rounded-xl border border-transparent hover:border-white/10 active:scale-[0.98] transition-transform select-none"
                  >
                    {t("reminder.button_acknowledge")}
                  </Button>
                  <Button
                    onClick={handleViewDetails}
                    className="order-1 sm:order-2 bg-brand-gradient text-white shadow-lg shadow-violet-500/20 font-bold text-xs py-2 px-4 rounded-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5 cursor-pointer select-none"
                  >
                    {t("reminder.button_start_work")}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
