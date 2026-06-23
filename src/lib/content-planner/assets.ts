export type ContentAsset = {
  originalUrl: string;
  previewUrl: string | null;
  label: string;
  kind: "image" | "link";
};

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|avif)(?:[?#].*)?$/i;
const URL_RE = /https?:\/\/[^\s,]+/g;

function cleanUrl(url: string) {
  return url.replace(/[)\].,;'"<>]+$/g, "");
}

function getGoogleDriveFileId(url: string) {
  const patterns = [
    /drive\.google\.com\/file\/d\/([^/?#]+)/i,
    /drive\.google\.com\/open\?id=([^&#]+)/i,
    /drive\.google\.com\/uc\?(?:[^#]*&)?id=([^&#]+)/i,
    /drive\.google\.com\/thumbnail\?(?:[^#]*&)?id=([^&#]+)/i,
    /[?&]id=([^&#]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return decodeURIComponent(match[1]);
  }

  return null;
}

function getPreviewUrl(url: string) {
  const driveId = getGoogleDriveFileId(url);
  if (driveId) {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w1600`;
  }

  if (IMAGE_EXT_RE.test(url)) return url;

  return null;
}

function getAssetLabel(url: string, index: number) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("drive.google.com")) return `Drive ${index + 1}`;
    const name = parsed.pathname.split("/").filter(Boolean).pop();
    return name ? decodeURIComponent(name).slice(0, 28) : `Asset ${index + 1}`;
  } catch {
    return `Asset ${index + 1}`;
  }
}

export function extractContentAssets(...sources: Array<string | null | undefined>): ContentAsset[] {
  const urls = sources
    .flatMap((source) => source?.match(URL_RE)?.map(cleanUrl) ?? [])
    .filter(Boolean);

  const uniqueUrls = Array.from(new Set(urls));

  return uniqueUrls.map((url, index) => {
    const previewUrl = getPreviewUrl(url);
    return {
      originalUrl: url,
      previewUrl,
      label: getAssetLabel(url, index),
      kind: previewUrl ? "image" : "link",
    };
  });
}
