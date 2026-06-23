import type { SupabaseClient } from "@supabase/supabase-js";

export const CONTENT_ASSET_BUCKET = "content-assets";
export const CONTENT_ASSET_MAX_FILE_SIZE = 10 * 1024 * 1024;
export const CONTENT_ASSET_RETENTION_MONTHS = 3;

const PAGE_SIZE = 100;

export async function ensureContentAssetBucket(adminClient: SupabaseClient) {
  const { data: buckets, error: listError } = await adminClient.storage.listBuckets();
  if (listError) throw listError;

  const bucket = buckets.find((item) => item.name === CONTENT_ASSET_BUCKET);
  if (bucket) {
    if (!bucket.public) {
      const { error: updateError } = await adminClient.storage.updateBucket(CONTENT_ASSET_BUCKET, {
        public: true,
        allowedMimeTypes: ["image/webp"],
        fileSizeLimit: CONTENT_ASSET_MAX_FILE_SIZE,
      });
      if (updateError) throw updateError;
    }
    return;
  }

  const { error: createError } = await adminClient.storage.createBucket(CONTENT_ASSET_BUCKET, {
    public: true,
    allowedMimeTypes: ["image/webp"],
    fileSizeLimit: CONTENT_ASSET_MAX_FILE_SIZE,
  });
  if (createError) throw createError;
}

export function getContentAssetExpiryCutoff(now = new Date()) {
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - CONTENT_ASSET_RETENTION_MONTHS);
  return cutoff;
}

function isStorageFolder(item: { id?: string | null; metadata?: unknown }) {
  return !item.id && !item.metadata;
}

async function collectExpiredAssetPaths(
  adminClient: SupabaseClient,
  cutoff: Date,
  prefix = "",
  paths: string[] = []
) {
  let offset = 0;

  while (true) {
    const { data, error } = await adminClient.storage.from(CONTENT_ASSET_BUCKET).list(prefix, {
      limit: PAGE_SIZE,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const item of data) {
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      if (isStorageFolder(item)) {
        await collectExpiredAssetPaths(adminClient, cutoff, path, paths);
        continue;
      }

      const createdAt = item.created_at ? new Date(item.created_at) : null;
      const updatedAt = item.updated_at ? new Date(item.updated_at) : null;
      const referenceDate = createdAt ?? updatedAt;
      if (referenceDate && referenceDate < cutoff) {
        paths.push(path);
      }
    }

    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return paths;
}

export async function cleanupExpiredContentAssets(adminClient: SupabaseClient) {
  const cutoff = getContentAssetExpiryCutoff();
  const expiredPaths = await collectExpiredAssetPaths(adminClient, cutoff);

  let deleted = 0;
  for (let i = 0; i < expiredPaths.length; i += PAGE_SIZE) {
    const batch = expiredPaths.slice(i, i + PAGE_SIZE);
    const { error } = await adminClient.storage.from(CONTENT_ASSET_BUCKET).remove(batch);
    if (error) throw error;
    deleted += batch.length;
  }

  return {
    cutoff: cutoff.toISOString(),
    deleted,
  };
}
