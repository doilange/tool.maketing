"use client";
import { Link, useRouter } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { Calendar, ClipboardCheck, LayoutDashboard, Table } from "lucide-react";
import { cn } from "@/lib/content-planner/utils";
import { useT } from "@/lib/content-planner/i18n";
import * as React from "react";

const links = [
  { href: "/content-planner", key: "sidebar.dashboard", icon: LayoutDashboard, exact: true },
  { href: "/content-planner/planner", key: "sidebar.planner", icon: Table, exact: false },
  { href: "/content-planner/review", key: "sidebar.review", icon: ClipboardCheck, exact: false },
  { href: "/content-planner/calendar", key: "sidebar.calendar", icon: Calendar, exact: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();
  const [isPending, startTransition] = React.useTransition();
  const [pendingHref, setPendingHref] = React.useState<string | null>(null);

  const isActive = (href: string, exact: boolean) => {
    if (!pathname) return false;
    // next-intl's usePathname already strips the locale prefix
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (isActive(href, href === "/content-planner")) return;
    setPendingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <>
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-slate-200 bg-white/90 p-4 gap-2 shadow-sm dark:border-white/10 dark:bg-[#0b1120]/90 z-20">
      <div className="flex items-center gap-3 px-2 py-3 select-none">
        <div className="relative rounded-full border border-violet-200 bg-white p-0.5 shadow-sm dark:border-violet-400/30 dark:bg-[#111827] shrink-0">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white dark:bg-[#111827] flex items-center justify-center">
            <img
              src="/logo.png"
              alt="MT Content Planner Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50 leading-tight">
            {t("sidebar.app_name")}
          </div>
          <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">
            {t("sidebar.tagline")}
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5 mt-4">
        {links.map((l) => {
          const active = isActive(l.href, l.exact);
          const pending = isPending && pendingHref === l.href;
          const showActive = active || pending;
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              prefetch={true}
              onClick={(e) => handleNavClick(e, l.href)}
              aria-current={showActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 h-11 text-sm font-medium transition-colors border",
                showActive
                  ? "bg-violet-50 text-violet-700 font-bold border-violet-200 dark:bg-violet-500/10 dark:text-violet-200 dark:border-violet-400/20"
                  : "text-muted-foreground border-transparent hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-slate-50"
              )}
            >
              <Icon className={cn("h-4.5 w-4.5", showActive ? "text-violet-700 dark:text-violet-200" : "text-slate-500 dark:text-slate-400")} />
              {t(l.key)}
              {pending && (
                <span className="ml-auto h-3.5 w-3.5 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto text-[10px] text-muted-foreground/60 px-3 font-medium tracking-wide">
        v0.1 · Supabase Realtime
      </div>
    </aside>
    <nav className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 grid grid-cols-4 gap-1 rounded-2xl border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-[#0b1120]/95 md:hidden">
      {links.map((l) => {
        const active = isActive(l.href, l.exact);
        const pending = isPending && pendingHref === l.href;
        const showActive = active || pending;
        const Icon = l.icon;
        return (
          <Link
            key={l.href}
            href={l.href}
            prefetch={true}
            onClick={(e) => handleNavClick(e, l.href)}
            aria-current={showActive ? "page" : undefined}
            className={cn(
              "relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[11px] font-semibold transition-colors",
              showActive
                ? "bg-violet-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            )}
          >
            <Icon className="h-4.5 w-4.5" />
            <span className="truncate">{t(l.key)}</span>
            {pending && <span className="absolute h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
          </Link>
        );
      })}
    </nav>
    </>
  );
}
