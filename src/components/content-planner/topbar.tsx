"use client";
import { useSyncExternalStore } from "react";
import { Code2, LogOut, Languages, Sun, Moon } from "lucide-react";
import { initials } from "@/lib/content-planner/utils";
import { useData } from "@/components/content-planner/data-provider";
import { Button } from "@/components/content-planner/ui/button";
import { useT, useLang } from "@/lib/content-planner/i18n";
import { useTheme } from "next-themes";
import type { UserRole } from "@/lib/content-planner/types";

const DEV_ROLE_OPTIONS: UserRole[] = ["admin", "manager", "creator", "viewer"];

export function Topbar() {
  const {
    me,
    realRole,
    devRoleOverride,
    isDevRoleSwitchEnabled,
    setDevRoleOverride,
    signOut,
  } = useData();
  const t = useT();
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const toggleLanguage = () => {
    setLang(lang === "th" ? "en" : "th");
  };

  const roleLabel = (role: string | undefined) => t(`role.${role ?? "viewer"}`);

  return (
    <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#0b1120]/90 md:px-6 select-none">
      <div className="min-w-0 text-sm text-muted-foreground">
        <span className="hidden sm:inline">{t("common.welcome_back")} </span>
        <span className="font-bold text-foreground truncate">
          {me?.full_name ?? t("common.guest")}
        </span>
      </div>
      
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Language Toggler */}
        <button
          onClick={toggleLanguage}
          className="flex h-10 items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-muted-foreground shadow-sm transition-colors hover:border-violet-200 hover:text-violet-700 dark:border-white/10 dark:bg-[#111827] dark:hover:text-violet-300 cursor-pointer"
          aria-label="Change language"
        >
          <Languages className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
          <span>{lang.toUpperCase()}</span>
        </button>

        {/* Theme Switcher */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-muted-foreground shadow-sm transition-colors hover:border-violet-200 hover:text-violet-700 dark:border-white/10 dark:bg-[#111827] dark:hover:text-violet-300 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-violet-500" />
            )}
          </button>
        )}

        {mounted && isDevRoleSwitchEnabled && (
          <label
            className="hidden min-h-10 items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 text-xs font-semibold text-amber-800 shadow-sm dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200 md:flex"
            title={t("dev.role_switch")}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>{t("dev.role")}</span>
            <select
              value={devRoleOverride ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                setDevRoleOverride(value ? (value as UserRole) : null);
              }}
              className="h-7 rounded-md border border-amber-200 bg-white px-2 text-xs font-bold text-foreground outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-300/30 dark:border-amber-400/20 dark:bg-[#111827]"
            >
              <option value="">
                {t("dev.real_role", { role: roleLabel(realRole ?? me?.role) })}
              </option>
              {DEV_ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {roleLabel(role)}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="hidden h-5 w-px self-center bg-slate-200 dark:bg-white/10 sm:block" />

        {/* User Profile Info */}
        <div className="flex items-center gap-2">
          {/* Inner brand ring */}
          <div className="rounded-full border border-violet-200 bg-white p-0.5 shadow-sm dark:border-violet-400/30 dark:bg-[#111827] shrink-0">
            <div className="h-8 w-8 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 grid place-items-center text-xs font-extrabold">
              {initials(me?.full_name ?? "?")}
            </div>
          </div>
          <div className="hidden sm:block leading-tight text-left">
            <div className="text-xs font-bold text-foreground">{me?.full_name ?? "—"}</div>
            <div className="text-[10px] text-muted-foreground/80 font-medium">{roleLabel(me?.role)}</div>
          </div>
        </div>

        {/* Sign Out Button */}
        <Button variant="outline" size="sm" onClick={() => signOut()} title={t("common.sign_out")}>
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("common.sign_out")}</span>
        </Button>
      </div>
    </header>
  );
}
