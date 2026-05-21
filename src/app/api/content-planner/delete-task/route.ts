import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/content-planner/supabase/server";

/**
 * DELETE /api/content-planner/delete-task
 * Uses the Service Role Key to bypass RLS and delete a task.
 * Requires the user to be authenticated and have a non-viewer role.
 */
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing task id" }, { status: 400 });
    }

    // 1. Verify the user is authenticated using the normal (anon) client
    const userClient = await createServerClient();
    const {
      data: { user },
    } = await userClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check user role — only non-viewers can delete
    const { data: profile } = await userClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (!profile || profile.role === "viewer") {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์ลบ — เฉพาะ admin, manager, creator เท่านั้น" },
        { status: 403 }
      );
    }

    // 3. Check if the task is approved (approved tasks cannot be deleted)
    const { data: task } = await userClient
      .from("content_tasks")
      .select("id, approval_status, topic")
      .eq("id", id)
      .single();
    if (!task) {
      return NextResponse.json({ error: "ไม่พบงานนี้" }, { status: 404 });
    }
    if (task.approval_status === "approved") {
      return NextResponse.json(
        { error: "ไม่สามารถลบงานที่อนุมัติแล้วได้" },
        { status: 403 }
      );
    }

    // 4. Use Service Role Key to bypass RLS and delete
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Server config error: SUPABASE_SERVICE_ROLE_KEY is not set" },
        { status: 500 }
      );
    }
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );

    const { error: deleteError } = await adminClient
      .from("content_tasks")
      .delete()
      .eq("id", id);
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // 5. Log the activity
    await adminClient.from("activity_logs").insert({
      task_id: id,
      user_id: user.id,
      action: "task_deleted",
      old_value: { topic: task.topic },
    });

    return NextResponse.json({ success: true, deleted_id: id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
