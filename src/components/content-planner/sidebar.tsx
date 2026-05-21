"use client";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { usePathname } from "@/i18n/navigation";
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
    // next-intl's usePathname already strips the locale prefix
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-white/20 dark:border-white/5 bg-white/40 dark:bg-[#0a1128]/40 backdrop-blur-xl p-4 gap-2 shadow-xl z-20">
      <div className="flex items-center gap-3 px-2 py-3 select-none">
        {/* Outer brand gradient ring around logo */}
        <div className="relative p-[1px] bg-brand-gradient rounded-full shadow-md shadow-violet-500/5 shrink-0">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white dark:bg-[#131a30] flex items-center justify-center">
            <img
              src="/logo.png"
              alt="MT Content Planner Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className="text-sm font-extrabold bg-clip-text text-transparent bg-brand-gradient leading-tight">
            {t("sidebar.app_name")}
          </div>
          <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
            {t("sidebar.tagline")}
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5 mt-4">
        {links.map((l) => {
          const active = isActive(l.href, l.exact);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 h-10 text-sm font-medium transition-all duration-200 border",
                active
                  ? "bg-brand-gradient text-white shadow-lg shadow-violet-500/10 dark:shadow-violet-950/20 font-bold border-transparent"
                  : "text-muted-foreground border-transparent hover:bg-white/50 dark:hover:bg-[#1c2541]/40 hover:text-foreground hover:border-white/10 dark:hover:border-white/5"
              )}
            >
              <Icon className={cn("h-4.5 w-4.5", active ? "text-white" : "text-violet-500 dark:text-violet-400")} />
              {t(l.key)}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto text-[10px] text-muted-foreground/60 px-3 font-medium tracking-wide">
        v0.1 · Supabase Realtime
      </div>
    </aside>
  );
}
