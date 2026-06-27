"use client";

import { useState, useEffect, useCallback } from "react";
import * as OTPAuth from "otpauth";
import { ShieldCheck, Copy, Check, KeyRound, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Authenticator() {
  const t = useTranslations("Auth2FA");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTOTP = useCallback((secretKey: string) => {
    try {
      // Remove spaces and make uppercase
      const cleanSecret = secretKey.replace(/\s+/g, "").toUpperCase();
      
      if (!cleanSecret) {
        setCode(null);
        setError(null);
        return;
      }

      const totp = new OTPAuth.TOTP({
        issuer: "MT Content Planner",
        label: "Authenticator",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(cleanSecret),
      });

      setCode(totp.generate());
      setError(null);
    } catch (err) {
      console.error(err);
      setCode(null);
      setError(t("invalidKey"));
    }
  }, [t]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateTOTP(secret);

    const updateTimer = () => {
      const epoch = Math.floor(Date.now() / 1000);
      const remaining = 30 - (epoch % 30);
      setTimeLeft(remaining);

      if (remaining === 30) {
        generateTOTP(secret); // Refresh code when timer resets
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [secret, generateTOTP]);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const progressPercentage = (timeLeft / 30) * 100;

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] relative overflow-hidden select-none">
      <div className="max-w-md w-full relative z-10">
        <div className="relative">
          <div className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm rounded-lg p-8 overflow-hidden">
            
            <div className="text-center mb-8">
              {/* Glow circle icon container */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100 mb-4 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/20">
                <div className="w-full h-full flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-300 " />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold tracking-tight text-foreground text-slate-950 dark:text-slate-50">
                {t("title")}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {t("description")}
              </p>
            </div>

            <div className="space-y-5">
              
              {/* Secret key field */}
              <div className="space-y-1.5">
                <label htmlFor="secret" className="text-xs font-semibold tracking-wide uppercase text-muted-foreground/90 pl-1 flex items-center">
                  <KeyRound className="w-4 h-4 mr-1.5 text-blue-600" />
                  {t("secretKey")}
                </label>
                <div className="relative group/input">
                  <input
                    id="secret"
                    type="text"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder={t("placeholder")}
                    className="w-full px-4 py-3 bg-white dark:bg-[#0b1020] border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg text-foreground font-mono text-center tracking-widest placeholder:tracking-normal focus:outline-none"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                </div>
                
                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg border border-rose-500/20 bg-rose-500/10  animate-in fade-in slide-in-from-top-1 duration-200 mt-2">
                    <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-rose-600 dark:text-rose-400 leading-normal">
                      {error}
                    </span>
                  </div>
                )}
              </div>

              {/* Glowing Glass Code Display Area */}
              {code && !error && (
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-6 text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    
                    {/* Glossy Gradient Code Text */}
                    <div className="text-5xl font-mono font-extrabold tracking-[0.2em] text-foreground text-slate-950 dark:text-slate-50 drop-shadow-sm flex items-center justify-center ml-2">
                      {code.slice(0, 3)}
                      <span className="text-muted-foreground/30 mx-1">-</span>
                      {code.slice(3, 6)}
                    </div>
                    
                    {/* Sub-bar displaying timer & Copy button */}
                    <div className="flex items-center justify-between w-full mt-4 bg-white dark:bg-[#0b1020] rounded-lg p-2 border border-slate-200 dark:border-white/10 shadow-sm">
                      <div className="flex items-center space-x-3 px-3 py-1.5">
                        <div className="relative w-6 h-6 flex items-center justify-center">
                          <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 36 36">
                            <circle
                              className="text-border dark:text-white/5"
                              cx="18"
                              cy="18"
                              r="15.9155"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3.5"
                            />
                            <circle
                              className={`${timeLeft <= 5 ? "text-rose-500 animate-pulse" : "text-blue-600 dark:text-blue-300"} transition-all duration-1000 ease-linear`}
                              strokeDasharray={`${progressPercentage}, 100`}
                              cx="18"
                              cy="18"
                              r="15.9155"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className={`absolute text-[10px] font-extrabold ${timeLeft <= 5 ? "text-rose-500 animate-pulse" : "text-foreground"}`}>
                            {timeLeft}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleCopy}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-semibold text-xs focus:outline-none active:scale-95 cursor-pointer ${
                          copied 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 shadow-sm shadow-emerald-500/5" 
                          : "bg-brand-gradient text-white hover:opacity-90 shadow-md shadow-blue-900/10"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{t("copied")}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{t("copyCode")}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Divider privacy footer */}
            <div className="mt-8 pt-6 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"></div>
              <p className="text-xs text-muted-foreground flex items-center justify-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-2.5 rounded-lg w-full font-medium">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-300/80" />
                {t("privacyNotice")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
