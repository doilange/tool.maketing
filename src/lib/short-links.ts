import { createClient } from "@supabase/supabase-js";
import path from 'path';
import fs from 'fs';

/**
 * Short link storage abstraction.
 * Automatically selects SQLite (Docker/local) or Supabase (Vercel/serverless).
 */

// ─── Detect writable filesystem ────────────────────────────────
let _canWriteFs: boolean | null = null;

function canWriteToFileSystem(): boolean {
  if (_canWriteFs !== null) return _canWriteFs;
  try {
    const dataDir = process.env.DATABASE_PATH
      ? path.dirname(process.env.DATABASE_PATH)
      : path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const testFile = path.join(dataDir, '.write-test');
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    _canWriteFs = true;
  } catch {
    _canWriteFs = false;
  }
  return _canWriteFs;
}

// ─── SQLite backend ────────────────────────────────────────────
function getSqliteDb() {
  // Dynamic import to avoid issues on serverless where better-sqlite3 may not be available
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getDb } = require('@/lib/db');
  return getDb();
}

// ─── Supabase backend ──────────────────────────────────────────
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error('Supabase not configured:', { hasUrl: !!url, hasKey: !!key });
    return null;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// ─── Public API ────────────────────────────────────────────────

export async function insertShortLink(id: string, originalUrl: string): Promise<{ success: boolean; error?: string }> {
  // Try SQLite first (Docker / local)
  if (canWriteToFileSystem()) {
    try {
      const db = getSqliteDb();
      const stmt = db.prepare('INSERT INTO short_links (id, original_url, created_at) VALUES (?, ?, ?)');
      stmt.run(id, originalUrl, Math.floor(Date.now() / 1000));
      return { success: true };
    } catch (e) {
      console.error('SQLite insert failed:', e);
      // Fall through to Supabase
    }
  }

  // Fallback: Supabase (Vercel / serverless)
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'No writable storage available' };
  }

  const { error } = await supabase
    .from('short_links')
    .insert([{ id, original_url: originalUrl }]);

  if (error) {
    console.error('Supabase insert failed:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getShortLink(id: string): Promise<string | null> {
  // Try SQLite first
  if (canWriteToFileSystem()) {
    try {
      const db = getSqliteDb();
      const row = db.prepare('SELECT original_url FROM short_links WHERE id = ?').get(id) as { original_url: string } | undefined;
      if (row?.original_url) return row.original_url;
    } catch (e) {
      console.error('SQLite read failed:', e);
      // Fall through to Supabase
    }
  }

  // Fallback: Supabase
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('short_links')
    .select('original_url')
    .eq('id', id)
    .single();

  if (error || !data?.original_url) return null;
  return data.original_url;
}
