"use client";
import * as React from "react";
import type {
  ActivityLog,
  Comment,
  ContentTask,
  Platform,
  Product,
  Profile,
} from "@/lib/content-planner/types";
import { createClient } from "@/lib/content-planner/supabase/client";

type DataContextValue = {
  loading: boolean;
  tasks: ContentTask[];
  profiles: Profile[];
  products: Product[];
  platforms: Platform[];
  comments: Comment[];
  activity: ActivityLog[];
  me: Profile | null;
  addTask: (task: Partial<ContentTask>) => Promise<ContentTask | null>;
  updateTask: (id: string, patch: Partial<ContentTask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addComment: (taskId: string, text: string) => Promise<void>;
  setApproval: (
    taskId: string,
    approval: ContentTask["approval_status"],
    progress?: ContentTask["progress_status"]
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

const DataContext = React.createContext<DataContextValue | null>(null);

function realtimeRowId(value: unknown) {
  if (!value || typeof value !== "object" || !("id" in value)) return undefined;
  const id = (value as { id?: unknown }).id;
  return typeof id === "string" ? id : undefined;
}

export function useData() {
  const ctx = React.useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const supabase = React.useMemo(() => createClient(), []);

  const [loading, setLoading] = React.useState(true);
  const [tasks, setTasks] = React.useState<ContentTask[]>([]);
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [platforms, setPlatforms] = React.useState<Platform[]>([]);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [activity, setActivity] = React.useState<ActivityLog[]>([]);
  const [meId, setMeId] = React.useState<string | null>(null);

  // ---------------- Initial fetch ----------------
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }
      if (!cancelled) setMeId(user.id);

      const [tasksRes, profilesRes, productsRes, platformsRes, commentsRes, activityRes] =
        await Promise.all([
          supabase.from("content_tasks").select("*").order("scheduled_date", { ascending: true }),
          supabase.from("profiles").select("*"),
          supabase.from("products").select("*").order("name"),
          supabase.from("platforms").select("*").order("name"),
          supabase.from("comments").select("*").order("created_at", { ascending: true }),
          supabase
            .from("activity_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100),
        ]);
      if (cancelled) return;
      if (tasksRes.data) setTasks(tasksRes.data as ContentTask[]);
      if (profilesRes.data) setProfiles(profilesRes.data as Profile[]);
      if (productsRes.data) setProducts(productsRes.data as Product[]);
      if (platformsRes.data) setPlatforms(platformsRes.data as Platform[]);
      if (commentsRes.data) setComments(commentsRes.data as Comment[]);
      if (activityRes.data) setActivity(activityRes.data as ActivityLog[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  // ---------------- Realtime subscriptions ----------------
  React.useEffect(() => {
    if (!meId) return;

    const channel = supabase
      .channel("content-planner")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "content_tasks" },
        (payload) => {
          console.log(
            "[Realtime] content_tasks:",
            payload.eventType,
            realtimeRowId(payload.new) || realtimeRowId(payload.old)
          );
          setTasks((prev) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as ContentTask;
              if (prev.some((t) => t.id === row.id)) return prev;
              return [...prev, row];
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as ContentTask;
              return prev.map((t) => (t.id === row.id ? row : t));
            }
            if (payload.eventType === "DELETE") {
              const row = payload.old as ContentTask;
              return prev.filter((t) => t.id !== row.id);
            }
            return prev;
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        (payload) => {
          console.log(
            "[Realtime] comments:",
            payload.eventType,
            realtimeRowId(payload.new) || realtimeRowId(payload.old)
          );
          setComments((prev) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as Comment;
              if (prev.some((c) => c.id === row.id)) return prev;
              return [...prev, row];
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as Comment;
              return prev.map((c) => (c.id === row.id ? row : c));
            }
            if (payload.eventType === "DELETE") {
              const row = payload.old as Comment;
              return prev.filter((c) => c.id !== row.id);
            }
            return prev;
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_logs" },
        (payload) => {
          const row = payload.new as ActivityLog;
          setActivity((prev) => [row, ...prev].slice(0, 100));
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          setProfiles((prev) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as Profile;
              if (prev.some((p) => p.id === row.id)) return prev;
              return [...prev, row];
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as Profile;
              return prev.map((p) => (p.id === row.id ? row : p));
            }
            if (payload.eventType === "DELETE") {
              const row = payload.old as Profile;
              return prev.filter((p) => p.id !== row.id);
            }
            return prev;
          });
        }
      )
      .subscribe((status, err) => {
        console.log("[Realtime] Subscription status:", status, err);
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, meId]);

  const me = React.useMemo(
    () => profiles.find((p) => p.id === meId) ?? null,
    [profiles, meId]
  );

  // ---------------- Mutations ----------------
  const logActivity = React.useCallback(
    async (
      taskId: string,
      action: string,
      oldValue: unknown,
      newValue: unknown
    ) => {
      if (!meId) return;
      await supabase
        .from("activity_logs")
        .insert({
          task_id: taskId,
          user_id: meId,
          action,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          old_value: oldValue as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          new_value: newValue as any,
        });
    },
    [supabase, meId]
  );

  const addTask = React.useCallback<DataContextValue["addTask"]>(
    async (task) => {
      if (!meId) return null;
      const insert = {
        week_group: task.week_group ?? null,
        start_date: task.start_date ?? null,
        due_date: task.due_date ?? null,
        scheduled_date: task.scheduled_date ?? null,
        day_name: task.day_name ?? null,
        post_time: task.post_time ?? null,
        workday_status: task.workday_status ?? "workday",
        platform: task.platform ?? null,
        product: task.product ?? null,
        topic: task.topic ?? "Untitled",
        content_type: task.content_type ?? null,
        progress_status: task.progress_status ?? "none",
        post_status: task.post_status ?? "not_posted",
        owner_id: task.owner_id ?? meId,
        caption: task.caption ?? null,
        creative_brief: task.creative_brief ?? null,
        file_url: task.file_url ?? null,
        posted_url_tiktok: task.posted_url_tiktok ?? null,
        posted_url_youtube: task.posted_url_youtube ?? null,
        posted_url_ig: task.posted_url_ig ?? null,
        posted_url_fb: task.posted_url_fb ?? null,
        note: task.note ?? null,
        approval_status: task.approval_status ?? "pending",
        created_by: meId,
      };
      const { data, error } = await supabase
        .from("content_tasks")
        .insert(insert)
        .select()
        .single();
      if (error) throw error;
      const created = data as ContentTask;
      logActivity(created.id, "task_created", null, { topic: created.topic });
      return created;
    },
    [supabase, meId, logActivity]
  );

  const updateTask = React.useCallback<DataContextValue["updateTask"]>(
    async (id, patch) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      const { id: _ignore, created_at, updated_at, ...clean } = patch as any;
      if (clean.progress_status === "waiting_comment" && clean.approval_status === undefined) {
        clean.approval_status = "pending";
      }
      const { error } = await supabase
        .from("content_tasks")
        .update(clean)
        .eq("id", id);
      if (error) throw error;
      logActivity(id, "task_updated", null, clean);
    },
    [supabase, logActivity]
  );

  const deleteTask = React.useCallback<DataContextValue["deleteTask"]>(
    async (id) => {
      // Use server-side API route with Service Role Key to bypass RLS
      const res = await fetch("/api/content-planner/delete-task", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error ?? "ลบไม่สำเร็จ");
      }
      // Immediately remove from local state for instant UI feedback
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    []
  );

  const addComment = React.useCallback<DataContextValue["addComment"]>(
    async (taskId, text) => {
      if (!meId || !text.trim()) return;
      const { data, error } = await supabase
        .from("comments")
        .insert({ task_id: taskId, user_id: meId, comment: text.trim() })
        .select()
        .single();
      if (error) throw error;
      setComments((prev) => {
        if (prev.some((c) => c.id === data.id)) return prev;
        return [...prev, data as Comment];
      });
      logActivity(taskId, "comment_added", null, { preview: text.slice(0, 80) });
    },
    [supabase, meId, logActivity]
  );

  const setApproval = React.useCallback<DataContextValue["setApproval"]>(
    async (taskId, approval, progress) => {
      const patch: Partial<ContentTask> = { approval_status: approval };
      if (progress) patch.progress_status = progress;
      const { error } = await supabase
        .from("content_tasks")
        .update(patch)
        .eq("id", taskId);
      if (error) throw error;
      logActivity(taskId, `approval_${approval}`, null, { approval_status: approval });
    },
    [supabase, logActivity]
  );

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
    const isEn = window.location.pathname.startsWith("/en");
    window.location.href = isEn ? "/en/content-planner/login" : "/content-planner/login";
  }, [supabase]);

  const value: DataContextValue = {
    loading,
    tasks,
    profiles,
    products,
    platforms,
    comments,
    activity,
    me,
    addTask,
    updateTask,
    deleteTask,
    addComment,
    setApproval,
    signOut,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
