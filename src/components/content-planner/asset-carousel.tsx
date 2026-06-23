"use client";
import * as React from "react";
import { Button } from "@/components/content-planner/ui/button";
import { cn } from "@/lib/content-planner/utils";
import type { ContentAsset } from "@/lib/content-planner/assets";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Image as ImageIcon,
  Images,
} from "lucide-react";

type CarouselState = {
  assetKey: string;
  index: number;
  failed: Set<string>;
};

const emptyFailed = new Set<string>();

export function AssetCarousel({
  assets,
  emptyText,
  className,
  compact = false,
  openLabel = "Open",
  unavailableText = "Preview unavailable",
}: {
  assets: ContentAsset[];
  emptyText: string;
  className?: string;
  compact?: boolean;
  openLabel?: string;
  unavailableText?: string;
}) {
  const assetKey = React.useMemo(
    () => assets.map((item) => item.originalUrl).join("\n"),
    [assets]
  );
  const [state, setState] = React.useState<CarouselState>(() => ({
    assetKey,
    index: 0,
    failed: new Set(),
  }));

  const isFreshState = state.assetKey === assetKey;
  const index = isFreshState ? Math.min(state.index, Math.max(assets.length - 1, 0)) : 0;
  const failed = isFreshState ? state.failed : emptyFailed;
  const asset = assets[index];
  const canGo = assets.length > 1;
  const hasPreview = asset?.previewUrl && !failed.has(asset.previewUrl);

  function move(delta: number) {
    if (!assets.length) return;
    setState((current) => {
      const currentIndex = current.assetKey === assetKey ? current.index : index;
      return {
        assetKey,
        index: (currentIndex + delta + assets.length) % assets.length,
        failed: current.assetKey === assetKey ? current.failed : new Set(),
      };
    });
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-sm dark:border-white/10", className)}>
      <div className={cn("relative grid place-items-center bg-slate-950", compact ? "aspect-[4/3]" : "aspect-[16/10]")}>
        {asset ? (
          <>
            {hasPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={asset.previewUrl!}
                alt={asset.label}
                className="h-full w-full object-contain"
                loading="lazy"
                onError={() => {
                  setState((current) => ({
                    assetKey,
                    index,
                    failed: new Set(current.assetKey === assetKey ? current.failed : emptyFailed).add(
                      asset.previewUrl!
                    ),
                  }));
                }}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-white/85">
                <ImageIcon className="h-10 w-10 text-white/55" />
                <div>
                  <div className="text-sm font-bold">{asset.label}</div>
                  <div className="mt-1 text-xs text-white/55">{unavailableText}</div>
                </div>
              </div>
            )}

            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
              <Images className="h-3.5 w-3.5" />
              {index + 1}/{assets.length}
            </div>

            <a
              href={asset.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute right-3 top-3 inline-flex min-h-8 items-center gap-1.5 rounded-full bg-black/55 px-3 text-[11px] font-bold text-white backdrop-blur transition-colors hover:bg-black/75"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {openLabel}
            </a>

            {canGo && (
              <>
                <button
                  type="button"
                  onClick={() => move(-1)}
                  className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/75"
                  aria-label="Previous asset"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/75"
                  aria-label="Next asset"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-white/70">
            <ImageIcon className="h-10 w-10 text-white/45" />
            <div className="text-sm font-bold">{emptyText}</div>
          </div>
        )}
      </div>

      {assets.length > 1 && (
        <div className="flex gap-2 overflow-x-auto bg-white p-2 dark:bg-[#111827]">
          {assets.map((item, itemIndex) => (
            <button
              key={item.originalUrl}
              type="button"
              onClick={() =>
                setState((current) => ({
                  assetKey,
                  index: itemIndex,
                  failed: current.assetKey === assetKey ? current.failed : new Set(),
                }))
              }
              className={cn(
                "relative h-14 w-16 shrink-0 overflow-hidden rounded-md border bg-slate-100 text-[10px] font-bold text-muted-foreground transition-colors dark:bg-white/5",
                itemIndex === index
                  ? "border-violet-500 ring-2 ring-violet-500/20"
                  : "border-slate-200 hover:border-violet-300 dark:border-white/10"
              )}
              title={item.label}
            >
              {item.previewUrl && !failed.has(item.previewUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={() =>
                    setState((current) => ({
                      assetKey,
                      index,
                      failed: new Set(current.assetKey === assetKey ? current.failed : emptyFailed).add(
                        item.previewUrl!
                      ),
                    }))
                  }
                />
              ) : (
                <span className="grid h-full w-full place-items-center px-1 text-center">Asset</span>
              )}
            </button>
          ))}
        </div>
      )}

      {asset && !compact && (
        <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-3 py-2 text-xs dark:border-white/10 dark:bg-[#111827]">
          <span className="truncate font-bold text-foreground">{asset.label}</span>
          {assets.length > 1 && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
