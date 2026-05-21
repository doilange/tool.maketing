"use client";
import { useEffect, useState } from "react";
import { LogOut, Languages, Sun, Moon } from "lucide-react";
import { initials } from "@/lib/content-planner/utils";
import { useData } from "@/components/content-planner/data-provider";
import { Button } from "@/components/content-planner/ui/button";
import { useT, useLang } from "@/lib/content-planner/i18n";
import { useTheme } from "next-themes";

export function Topbar() {
  const { me, signOut } = useData();
  const t = useT();
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLang(lang === "th" ? "en" : "th");
  };

  const roleLabel = (role: string | undefined) => t(`role.${role ?? "viewer"}`);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-6 py-3 border-b border-white/20 dark:border-white/5 bg-white/40 dark:bg-[#0a1128]/40 backdrop-blur-xl select-none shadow-sm">
      <div className="text-sm text-muted-foreground">
        <span className="hidden sm:inline">{t("common.welcome_back")} </span>
        <span className="font-bold text-foreground">
          {me?.full_name ?? t("common.guest")}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Language Toggler */}
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-1.5 px-3 h-8 bg-white/40 dark:bg-[#1c2541]/40 border border-white/15 dark:border-white/5 rounded-xl text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-500/20 transition-all active:scale-95 font-semibold text-xs shadow-sm cursor-pointer"
          aria-label="Change language"
        >
          <Languages className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
          <span>{lang.toUpperCase()}</span>
        </button>

        {/* Theme Switcher */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-8 h-8 bg-white/40 dark:bg-[#1c2541]/40 border border-white/15 dark:border-white/5 rounded-xl text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-500/20 transition-all active:scale-95 shadow-sm cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-violet-500" />
            )}
          </button>
        )}

        <div className="h-4 w-[1px] bg-white/20 dark:bg-white/10 self-center hidden sm:block" />

        {/* User Profile Info */}
        <div className="flex items-center gap-2">
          {/* Inner brand ring */}
          <div className="p-[1px] bg-brand-gradient rounded-full shadow-md shadow-violet-500/5 shrink-0">
            <div className="h-7 w-7 rounded-full bg-white dark:bg-[#131a30] text-violet-600 dark:text-violet-400 grid place-items-center text-xs font-extrabold">
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
