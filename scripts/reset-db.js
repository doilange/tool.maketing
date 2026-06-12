/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

function loadEnv() {
  const envPath = path.join(__dirname, "../.env.local");
  const env = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    content.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        env[key] = value.trim();
      }
    });
  }
  return env;
}

async function main() {
  console.log("🔄 Starting database reset...");
  const env = loadEnv();
  
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env.local");
    process.exit(1);
  }

  // Create Supabase client using Service Role Key to bypass RLS policies
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });

  try {
    // 1. Delete comments first (references content_tasks)
    console.log("🧹 Clearing 'comments' table...");
    const { error: commentsErr } = await supabase
      .from("comments")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Standard way to delete all rows in Supabase
    
    if (commentsErr) {
      console.warn("⚠️ Warning clearing comments:", commentsErr.message);
    } else {
      console.log("✅ 'comments' cleared successfully.");
    }

    // 2. Delete activity_logs (references content_tasks)
    console.log("🧹 Clearing 'activity_logs' table...");
    const { error: activityErr } = await supabase
      .from("activity_logs")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    
    if (activityErr) {
      console.warn("⚠️ Warning clearing activity_logs:", activityErr.message);
    } else {
      console.log("✅ 'activity_logs' cleared successfully.");
    }

    // 3. Delete content_tasks
    console.log("🧹 Clearing 'content_tasks' table...");
    const { error: tasksErr } = await supabase
      .from("content_tasks")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    
    if (tasksErr) {
      console.error("❌ Error clearing content_tasks:", tasksErr.message);
      throw tasksErr;
    } else {
      console.log("✅ 'content_tasks' cleared successfully.");
    }

    console.log("\n🎉 Database reset complete! All test data cleared.");
  } catch (error) {
    console.error("❌ Database reset failed:", error);
    process.exit(1);
  }
}

main();
