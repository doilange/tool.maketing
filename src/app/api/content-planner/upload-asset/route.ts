import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/content-planner/supabase/server";
import {
  cleanupExpiredContentAssets,
  CONTENT_ASSET_BUCKET,
  CONTENT_ASSET_MAX_FILE_SIZE,
  ensureContentAssetBucket,
} from "@/lib/content-planner/storage-assets";

function safeFileName(name: string) {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "asset"
  );
}

export async function POST(req: NextRequest) {
  try {
    const userClient = await createServerClient();
    const {
      data: { user },
    } = await userClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await userClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (!profile || profile.role === "viewer") {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์อัปโหลดไฟล์ — เฉพาะ creator, manager, admin เท่านั้น" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const originalName = String(formData.get("originalName") ?? "asset");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    if (file.type !== "image/webp") {
      return NextResponse.json({ error: "Only WebP images are accepted" }, { status: 400 });
    }
    if (file.size > CONTENT_ASSET_MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File is too large" }, { status: 413 });
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Server config error: SUPABASE_SERVICE_ROLE_KEY is not set" },
        { status: 500 }
      );
    }

    const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    await ensureContentAssetBucket(adminClient);
    cleanupExpiredContentAssets(adminClient).catch((error) => {
      console.warn("Content asset cleanup failed:", error);
    });

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const path = `${user.id}/${year}/${month}/${crypto.randomUUID()}-${safeFileName(originalName)}.webp`;
    const body = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await adminClient.storage
      .from(CONTENT_ASSET_BUCKET)
      .upload(path, body, {
        contentType: "image/webp",
        cacheControl: "7776000",
        upsert: false,
      });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = adminClient.storage.from(CONTENT_ASSET_BUCKET).getPublicUrl(path);

    return NextResponse.json({
      success: true,
      bucket: CONTENT_ASSET_BUCKET,
      path,
      publicUrl: data.publicUrl,
      size: file.size,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
