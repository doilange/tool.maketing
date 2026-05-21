"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 planner-theme overflow-hidden select-none">
      {/* Slow-floating background glow backlights */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-violet-400/20 dark:bg-violet-500/10 blur-[80px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-pink-400/20 dark:bg-pink-500/10 blur-[90px] pointer-events-none animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-blue-300/15 dark:bg-blue-600/5 blur-[100px] pointer-events-none animate-pulse-soft" />

      {/* Floating Theme & Language controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2.5">
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-1.5 px-3 h-9 bg-white/40 dark:bg-[#1c2541]/40 border border-white/15 dark:border-white/5 rounded-xl text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-500/20 transition-all active:scale-95 font-semibold text-xs shadow-sm cursor-pointer"
          aria-label="Change language"
        >
          <Languages className="h-4 w-4 text-violet-500 dark:text-violet-400" />
          <span>{locale === "th" ? "TH" : "EN"}</span>
        </button>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-9 h-9 bg-white/40 dark:bg-[#1c2541]/40 border border-white/15 dark:border-white/5 rounded-xl text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-500/20 transition-all active:scale-95 shadow-sm cursor-pointer"
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

      {/* Centered Login Card Container */}
      <div className="w-full max-w-[440px] z-10">
        <div className="relative group/card transition-all duration-300 animate-in fade-in zoom-in-95 duration-500">
          
          {/* Outer glowing halo wrap */}
          <div className="absolute inset-0 bg-brand-gradient opacity-10 dark:opacity-15 blur-2xl rounded-3xl scale-[1.02] pointer-events-none transition-all duration-300 group-hover/card:opacity-15 dark:group-hover/card:opacity-20" />
          
          {/* Glowing gradient border line */}
          <div className="absolute inset-0 bg-brand-gradient opacity-20 dark:opacity-30 rounded-3xl p-[1px] pointer-events-none" />
          
          {/* The Glassmorphism card container */}
          <div className="relative bg-white/70 dark:bg-[#131a30]/70 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl rounded-3xl p-8 overflow-hidden">
            
            {/* Header decoration */}
            <div className="flex flex-col items-center justify-center text-center">
              
              {/* Outer brand gradient ring around logo */}
              <div className="relative p-[1.5px] bg-brand-gradient rounded-full shadow-lg shadow-violet-500/10 mb-4 group-hover/card:scale-105 transition-transform duration-300">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white dark:bg-[#131a30] flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="MT Content Planner Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Glossy Brand Gradient Title Text */}
              <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-brand-gradient dark:from-white dark:to-slate-300">
                MT Content Planner
              </h1>
              
              <p className="text-xs font-extrabold text-violet-600 dark:text-violet-400 tracking-wider uppercase mt-1">
                {mode === "signin" ? t("login.welcome_back") : t("login.create_account")}
              </p>
              
              <p className="text-sm text-muted-foreground mt-2 mb-8">
                {mode === "signin" ? t("login.signin_subtitle") : t("login.signup_subtitle")}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              
              {/* Full name field (only for signup) */}
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground/90 pl-1">
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
                      className="pl-10.5 pr-4 h-11 bg-white/40 dark:bg-[#0a1128]/40 border border-border/80 group-focus-within/input:border-violet-500 group-focus-within/input:ring-2 group-focus-within/input:ring-violet-500/10 transition-all rounded-xl placeholder:text-muted-foreground/40 text-foreground"
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground/90 pl-1">
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
                    className="pl-10.5 pr-4 h-11 bg-white/40 dark:bg-[#0a1128]/40 border border-border/80 group-focus-within/input:border-violet-500 group-focus-within/input:ring-2 group-focus-within/input:ring-violet-500/10 transition-all rounded-xl placeholder:text-muted-foreground/40 text-foreground"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground/90 pl-1">
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
                    className="pl-10.5 pr-11 h-11 bg-white/40 dark:bg-[#0a1128]/40 border border-border/80 group-focus-within/input:border-violet-500 group-focus-within/input:ring-2 group-focus-within/input:ring-violet-500/10 transition-all rounded-xl placeholder:text-muted-foreground/40 text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/60 hover:text-violet-500 dark:hover:text-violet-400 focus:outline-none transition-colors"
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
                className="w-full h-11 bg-brand-gradient hover:opacity-90 active:scale-[0.98] transition-all rounded-xl shadow-lg shadow-violet-500/15 dark:shadow-violet-950/20 text-white font-medium flex items-center justify-center border-none mt-2"
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
    </div>
  );
}
