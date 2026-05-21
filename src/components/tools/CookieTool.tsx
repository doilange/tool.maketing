"use client";

import { useState, useCallback } from "react";
import { Copy, Trash2, ArrowDownAZ, ArrowDownZA, Check, AlertCircle, Cookie, ShieldCheck, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CookieTool() {
  const t = useTranslations("CookieTool");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState({ input: 0, output: 0 });

  const getLines = useCallback((text: string) => {
    return text.split('\n').filter(line => line.trim() !== '');
  }, []);

  const updateOutput = useCallback((lines: string[]) => {
    let result = lines;
    if (removeDuplicates) {
      result = Array.from(new Set(result));
    }
    const text = result.join('\n');
    setOutput(text);
    setLineCount(prev => ({ ...prev, output: result.length }));
  }, [removeDuplicates]);

  const updateInput = (text: string) => {
    setInput(text);
    setLineCount(prev => ({ ...prev, input: getLines(text).length }));
  };

  // Extract c_user UID from cookie string
  const extractUid = () => {
    const lines = getLines(input);
    const result: string[] = [];
    
    for (const line of lines) {
      const cUserMatch = line.match(/c_user[=:]\s*(\d+)/);
      if (cUserMatch) {
        result.push(cUserMatch[1]);
        continue;
      }
      
      const profileMatch = line.match(/profile_id[=:]\s*(\d+)/);
      if (profileMatch) {
        result.push(profileMatch[1]);
        continue;
      }
      
      if (/^\d{8,20}$/.test(line.trim())) {
        result.push(line.trim());
        continue;
      }
      
      const numMatch = line.match(/\b(\d{10,20})\b/);
      if (numMatch) {
        result.push(numMatch[1]);
      }
    }
    
    updateOutput(result);
  };

  // Sort cookies by the c_user UID found in each line
  const sortCookieByUid = () => {
    const lines = getLines(input);
    const result = [...lines].sort((a, b) => {
      const matchA = a.match(/c_user[=:]\s*(\d+)/);
      const matchB = b.match(/c_user[=:]\s*(\d+)/);
      const uidA = matchA ? matchA[1] : "";
      const uidB = matchB ? matchB[1] : "";
      return uidA.localeCompare(uidB, undefined, { numeric: true });
    });
    updateOutput(result);
  };

  // Sort UID (pure numbers, one per line)
  const sortUid = () => {
    const lines = getLines(input);
    const result = [...lines].sort((a, b) => {
      const numA = parseInt(a.trim()) || 0;
      const numB = parseInt(b.trim()) || 0;
      return numA - numB;
    });
    updateOutput(result);
  };

  // Extract Facebook access tokens (EAAA...)
  const extractToken = () => {
    const lines = getLines(input);
    const result: string[] = [];
    
    for (const line of lines) {
      const tokenMatch = line.match(/(EAA[A-Za-z0-9]+)/);
      if (tokenMatch) {
        result.push(tokenMatch[1]);
        continue;
      }
      
      const jsonMatch = line.match(/["']access_token["']\s*[:=]\s*["']([^"']+)["']/);
      if (jsonMatch) {
        result.push(jsonMatch[1]);
      }
    }
    
    updateOutput(result);
  };

  // Remove cookies that don't have c_user (invalid/dead cookies)
  const removeInvalidCookies = () => {
    const lines = getLines(input);
    const result = lines.filter(line => /c_user[=:]\s*\d+/.test(line));
    updateOutput(result);
  };

  // Format: UID|Cookie (useful for FB tools that need this format)
  const formatUidCookie = () => {
    const lines = getLines(input);
    const result = lines.map(line => {
      const match = line.match(/c_user[=:]\s*(\d+)/);
      if (match) {
        return `${match[1]}|${line.trim()}`;
      }
      return line.trim();
    });
    updateOutput(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const sortLines = (direction: 'asc' | 'desc') => {
    const lines = getLines(output || input);
    const sorted = [...lines].sort();
    if (direction === 'desc') sorted.reverse();
    updateOutput(sorted);
  };

  return (
    <div className="container mx-auto px-4 py-8 select-none max-w-5xl space-y-6">
      {/* Title section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center mb-2 bg-clip-text text-transparent bg-brand-gradient dark:from-white dark:to-slate-300">
            <Cookie className="w-8 h-8 mr-3 text-violet-500 dark:text-violet-400 animate-pulse-soft" />
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t("desc")}
          </p>
        </div>

        {/* Premium Dupes slider toggle */}
        <div className="flex items-center space-x-3 bg-white/40 dark:bg-[#0a1128]/45 px-4 py-2.5 rounded-2xl border border-white/10 dark:border-white/5 shadow-sm self-start md:self-center">
          <span className="text-xs font-bold text-foreground">{t("removeDupes")}</span>
          <button
            onClick={() => setRemoveDuplicates(!removeDuplicates)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
              removeDuplicates ? 'bg-brand-gradient' : 'bg-white/60 dark:bg-[#1c2541]'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${
                removeDuplicates ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Glass Panel */}
      <div className="relative group/panel transition-all duration-300">
        <div className="absolute inset-0 bg-brand-gradient opacity-5 dark:opacity-10 blur-2xl rounded-3xl scale-[1.01] pointer-events-none" />
        <div className="absolute inset-0 bg-brand-gradient opacity-15 dark:opacity-25 rounded-3xl p-[1px] pointer-events-none" />
        <div className="relative bg-white/70 dark:bg-[#131a30]/70 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl rounded-3xl p-6 overflow-hidden space-y-6">
          
          {/* Action Buttons - Main */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center">
              <ShieldCheck className="w-4.5 h-4.5 mr-1.5 text-violet-500" />
              {t("mainFunc")}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button onClick={extractUid} className="bg-brand-gradient text-white hover:opacity-90 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-violet-500/10 cursor-pointer">
                {t("extractUid")}
              </button>
              <button onClick={extractToken} className="bg-brand-gradient text-white hover:opacity-90 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-violet-500/10 cursor-pointer">
                {t("extractToken")}
              </button>
              <button onClick={sortCookieByUid} className="flex items-center px-4 py-2.5 bg-white/50 hover:bg-white/80 dark:bg-[#1c2541]/40 dark:hover:bg-[#1c2541]/60 text-foreground border border-white/10 dark:border-white/5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer">
                {t("sortCookie")}
              </button>
              <button onClick={sortUid} className="flex items-center px-4 py-2.5 bg-white/50 hover:bg-white/80 dark:bg-[#1c2541]/40 dark:hover:bg-[#1c2541]/60 text-foreground border border-white/10 dark:border-white/5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer">
                {t("sortUid")}
              </button>
              <button onClick={removeInvalidCookies} className="flex items-center px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer">
                {t("removeInvalid")}
              </button>
              <button onClick={formatUidCookie} className="flex items-center px-4 py-2.5 bg-white/50 hover:bg-white/80 dark:bg-[#1c2541]/40 dark:hover:bg-[#1c2541]/60 text-foreground border border-white/10 dark:border-white/5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer">
                {t("formatUid")}
              </button>
            </div>
          </div>

          {/* Sort Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-2 border-t border-white/5">
            <button onClick={() => sortLines('asc')} className="flex items-center px-4 py-2 bg-white/40 hover:bg-white/60 dark:bg-[#1c2541]/30 dark:hover:bg-[#1c2541]/50 text-foreground border border-white/10 dark:border-white/5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer">
              <ArrowDownAZ className="w-4 h-4 mr-1.5 text-violet-500" /> A - Z
            </button>
            <button onClick={() => sortLines('desc')} className="flex items-center px-4 py-2 bg-white/40 hover:bg-white/60 dark:bg-[#1c2541]/30 dark:hover:bg-[#1c2541]/50 text-foreground border border-white/10 dark:border-white/5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer">
              <ArrowDownZA className="w-4 h-4 mr-1.5 text-violet-500" /> Z - A
            </button>
          </div>

          {/* Input / Output Editors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Input Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">{t("input")} <span className="text-violet-500 font-mono">({lineCount.input})</span></label>
                <button
                  onClick={() => { updateInput(""); }}
                  className="text-[11px] font-bold flex items-center text-muted-foreground/80 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> {t("clear")}
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => updateInput(e.target.value)}
                className="w-full h-80 p-4 bg-white/40 dark:bg-[#0a1128]/45 border border-border/80 dark:border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all rounded-2xl text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/30"
                placeholder={t("placeholder")}
              />
            </div>

            {/* Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">{t("output")} <span className="text-violet-500 font-mono">({lineCount.output})</span></label>
                <div className="flex space-x-3.5">
                  <button
                    onClick={copyToClipboard}
                    disabled={!output}
                    className={`text-[11px] font-bold flex items-center transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${
                      copied ? "text-emerald-500 hover:text-emerald-600" : "text-violet-500 hover:text-violet-600"
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    {copied ? t("copied") : t("copy")}
                  </button>
                  <button
                    onClick={() => { setOutput(""); setLineCount(prev => ({ ...prev, output: 0 })); }}
                    className="text-[11px] font-bold flex items-center text-muted-foreground/80 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> {t("clear")}
                  </button>
                </div>
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-80 p-4 bg-violet-500/5 dark:bg-[#0a1128]/25 border border-border/80 dark:border-white/10 rounded-2xl text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/20"
                placeholder={t("output")}
              />
            </div>
          </div>

          {/* Tips Section */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-md p-4 text-sm text-blue-700 dark:text-blue-300">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-500" />
              <div>
                <p className="font-extrabold mb-1.5 text-xs uppercase tracking-wide">{t("tips")}</p>
                <ul className="list-disc list-inside space-y-1 text-xs opacity-90 leading-relaxed font-medium">
                  <li>{t("tip1")}</li>
                  <li>{t("tip2")}</li>
                  <li>{t("tip3")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
