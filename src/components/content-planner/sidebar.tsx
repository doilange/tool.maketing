"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Table, Calendar } from "lucide-react";
import { cn } from "@/lib/content-planner/utils";
import { useT } from "@/lib/content-planner/i18n";

const links = [
  { href: "/content-planner", key: "sidebar.dashboard", icon: LayoutDashboard, exact: true },
  { href: "/content-planner/planner", key: "sidebar.planner", icon: Table, exact: false },
  { href: "/content-planner/calendar", key: "sidebar.calendar", icon: Calendar, exact: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useT();

  const isActive = (href: string, exact: boolean) => {
    if (!pathname) return false;
    // Strip locale prefix for matching
    const cleanPath = pathname.replace(/^\/(en|th)/, "") || "/";
    if (exact) return cleanPath === href;
    return cleanPath.startsWith(href);
  };

  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-violet-100 bg-white/60 backdrop-blur p-4 gap-2">
      <div className="flex items-center gap-2 px-2 py-3">
        <div>
          <div className="text-sm font-semibold text-slate-800 leading-tight">{t("sidebar.app_name")}</div>
          <div className="text-[11px] text-slate-500">{t("sidebar.tagline")}</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1 mt-2">
        {links.map((l) => {
          const active = isActive(l.href, l.exact);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-gradient text-white shadow-sm"
                  : "text-slate-600 hover:bg-violet-50"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(l.key)}
            </Link>
          );
        })}

      </nav>
      <div className="mt-auto text-[11px] text-slate-400 px-3">
        v0.1 · Supabase Realtime
      </div>
    </aside>
  );
}
