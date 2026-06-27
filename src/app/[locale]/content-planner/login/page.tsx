"use client";
import { useState, useSyncExternalStore } from "react";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { createClient } from "@/lib/content-planner/supabase/client";
import { Button } from "@/components/content-planner/ui/button";
import { Input } from "@/components/content-planner/ui/input";
import { Label } from "@/components/content-planner/ui/label";
import { useT } from "@/lib/content-planner/i18n";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Languages,
  Sun,
  Moon,
  LayoutDashboard,
  Wrench,
} from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useT();
  const { theme, setTheme } = useTheme();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const toggleLanguage = () => {
    const nextLocale = locale === "th" ? "en" : "th";
    router.replace(pathname, { locale: nextLocale });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/content-planner";
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        setInfo(t("login.check_email"));
        setMode("signin");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message ?? t("login.auth_failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[100svh] w-full items-center justify-center overflow-x-hidden px-4 py-20 planner-theme sm:p-6">
      <nav className="absolute left-4 top-4 z-20 flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-[#111827]">
        <Link
          href="/content-planner/login"
          className="flex h-9 items-center gap-1.5 rounded-md bg-slate-900 px-3 text-xs font-semibold text-white transition-colors dark:bg-white dark:text-slate-950"
          aria-current="page"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("common.content_planner")}</span>
          <span className="sm:hidden">Planner</span>
        </Link>
        <Link
          href="/tool"
          className="flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-slate-50"
        >
          <Wrench className="h-3.5 w-3.5" />
          <span>{t("common.tools")}</span>
        </Link>
      </nav>

      <div className="absolute right-4 top-4 z-20 flex items-center space-x-2">
        <button
          onClick={toggleLanguage}
          className="flex h-11 items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-muted-foreground shadow-sm transition-colors hover:border-violet-200 hover:text-violet-700 dark:border-white/10 dark:bg-[#111827] dark:hover:text-violet-300 cursor-pointer"
          aria-label="Change language"
        >
          <Languages className="h-4 w-4 text-violet-500 dark:text-violet-400" />
          <span>{locale === "th" ? "TH" : "EN"}</span>
        </button>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-muted-foreground shadow-sm transition-colors hover:border-violet-200 hover:text-violet-700 dark:border-white/10 dark:bg-[#111827] dark:hover:text-violet-300 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5 text-amber-400" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-violet-500" />
            )}
          </button>
        )}
      </div>

      <div className="z-10 w-full max-w-[420px]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#111827] sm:p-8">
            
            {/* Header decoration */}
            <div className="flex flex-col items-center justify-center text-center">
              
              <div className="mb-4 rounded-full border border-violet-200 bg-white p-1 shadow-sm dark:border-violet-400/30 dark:bg-[#111827]">
                <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white dark:bg-[#111827]">
                  <img
                    src="/logo.png"
                    alt="MT Content Planner Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
                MT Content Planner
              </h1>
              
              <p className="mt-1 text-sm font-bold text-violet-700 dark:text-violet-300">
                {mode === "signin" ? t("login.welcome_back") : t("login.create_account")}
              </p>
              
              <p className="mb-7 mt-2 text-sm text-muted-foreground">
                {mode === "signin" ? t("login.signin_subtitle") : t("login.signup_subtitle")}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              
              {/* Full name field (only for signup) */}
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {t("login.full_name")}
                  </Label>
                  <div className="relative group/input">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 group-focus-within/input:text-violet-500 dark:group-focus-within/input:text-violet-400 transition-colors duration-200 pointer-events-none">
                      <User className="w-4.5 h-4.5" />
                    </span>
                    <Input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="h-11 pl-10.5 pr-4"
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t("login.email")}
                </Label>
                <div className="relative group/input">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 group-focus-within/input:text-violet-500 dark:group-focus-within/input:text-violet-400 transition-colors duration-200 pointer-events-none">
                    <Mail className="w-4.5 h-4.5" />
                  </span>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-11 pl-10.5 pr-4"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t("login.password")}
                </Label>
                <div className="relative group/input">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 group-focus-within/input:text-violet-500 dark:group-focus-within/input:text-violet-400 transition-colors duration-200 pointer-events-none">
                    <Lock className="w-4.5 h-4.5" />
                  </span>
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 pl-10.5 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-slate-100 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:bg-white/10 dark:hover:text-violet-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Elegant Translucent Errors */}
              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-rose-600 dark:text-rose-400 leading-normal">
                    {error}
                  </span>
                </div>
              )}

              {info && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-200">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 leading-normal">
                    {info}
                  </span>
                </div>
              )}

              {/* Submit CTA Button */}
              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 w-full"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t("login.please_wait")}
                  </span>
                ) : (
                  mode === "signin" ? t("login.signin") : t("login.create_account")
                )}
              </Button>
            </form>

            {/* Form Mode Switcher Footer */}
            <div className="mt-6 text-xs text-center text-muted-foreground/80 font-medium">
              {mode === "signin" ? t("login.new_here") : t("login.already_have_account")}{" "}
              <button
                type="button"
                className="text-violet-600 dark:text-violet-400 font-semibold hover:underline transition-colors hover:text-violet-500"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError(null);
                  setInfo(null);
                }}
              >
                {mode === "signin" ? t("login.create_account") : t("login.signin")}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
