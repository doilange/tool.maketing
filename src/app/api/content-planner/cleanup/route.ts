import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // Use service role to bypass RLS for cleanup
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateString = thirtyDaysAgo.toISOString();

    // 1. Delete activity logs older than 30 days
    const { error: activityError } = await adminClient
      .from("activity_logs")
      .delete()
      .lt("created_at", dateString);

    if (activityError) {
      console.error("Failed to delete old activity logs:", activityError);
    }

    // 2. Delete comments older than 30 days
    const { error: commentsError } = await adminClient
      .from("comments")
      .delete()
      .lt("created_at", dateString);

    if (commentsError) {
      console.error("Failed to delete old comments:", commentsError);
    }

    return NextResponse.json({ success: true, message: "Cleanup completed successfully" });
  } catch (error: any) {
    console.error("Cleanup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
