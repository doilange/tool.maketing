"use client";
import { LogOut, Languages } from "lucide-react";
import { initials } from "@/lib/content-planner/utils";
import { useData } from "@/components/content-planner/data-provider";
import { Button } from "@/components/content-planner/ui/button";
import { useLang, useT } from "@/lib/content-planner/i18n";

export function Topbar() {
  const { me, signOut } = useData();
  const t = useT();
  const { lang, setLang } = useLang();
  const roleLabel = (role: string | undefined) => t(`role.${role ?? "viewer"}`);
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-6 py-3 border-b border-violet-100 bg-white/70 backdrop-blur">
      <div className="text-sm text-slate-500">
        <span className="hidden sm:inline">{t("common.welcome_back")} </span>
        <span className="font-semibold text-slate-800">
          {me?.full_name ?? t("common.guest")}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1 rounded-lg border border-violet-200 bg-white/80 px-1 py-1">
          <Languages className="h-3.5 w-3.5 text-slate-400 ml-1" />
          <button
            onClick={() => setLang("th")}
            className={`px-2 py-0.5 text-xs rounded-md font-medium transition-colors ${
              lang === "th" ? "bg-brand-gradient text-white" : "text-slate-500 hover:bg-violet-50"
            }`}
          >
            ไทย
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-2 py-0.5 text-xs rounded-md font-medium transition-colors ${
              lang === "en" ? "bg-brand-gradient text-white" : "text-slate-500 hover:bg-violet-50"
            }`}
          >
            EN
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-pink-gradient-strong text-white grid place-items-center text-xs font-semibold">
            {initials(me?.full_name ?? "?")}
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-xs font-semibold text-slate-800">{me?.full_name ?? "—"}</div>
            <div className="text-[10px] text-slate-500">{roleLabel(me?.role)}</div>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={() => signOut()} title={t("common.sign_out")}>
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("common.sign_out")}</span>
        </Button>
      </div>
    </header>
  );
}
