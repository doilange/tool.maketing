"use client";

import { useState, useCallback } from "react";
import { Copy, Trash2, Check, Calendar, Info, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

// Facebook UID ranges based on known data
// These ranges are approximate and based on community research
const UID_RANGES: Array<{ prefix: string; yearRange: string; note?: string }> = [
  // Very old accounts (short UIDs)
  { prefix: "4", yearRange: "2004", note: "Mark Zuckerberg's account" },
  
  // Old-format UIDs (8-10 digits, no prefix pattern)
  // New-format UIDs start with 1000xxxxx
  { prefix: "1000000", yearRange: "2009-2011" },
  { prefix: "1000010", yearRange: "2011-2012" },
  { prefix: "1000020", yearRange: "2012-2013" },
  { prefix: "1000030", yearRange: "2013-2014" },
  { prefix: "1000040", yearRange: "2014-2015" },
  { prefix: "1000050", yearRange: "2015-2016" },
  { prefix: "1000060", yearRange: "2016-2017" },
  { prefix: "1000070", yearRange: "2017-2018" },
  { prefix: "1000080", yearRange: "2018-2019" },
  { prefix: "1000090", yearRange: "2019-2020" },
  { prefix: "100010", yearRange: "2020-2021" },
  { prefix: "100011", yearRange: "2021" },
  { prefix: "100012", yearRange: "2021-2022" },
  { prefix: "100013", yearRange: "2022" },
  { prefix: "100014", yearRange: "2022-2023" },
  { prefix: "100015", yearRange: "2023" },
  { prefix: "100016", yearRange: "2023-2024" },
  { prefix: "100017", yearRange: "2024" },
  { prefix: "100018", yearRange: "2024-2025" },
  { prefix: "100019", yearRange: "2025" },
  
  // Page IDs / Business accounts
  { prefix: "61550", yearRange: "2023 (Page)", note: "Facebook Page" },
  { prefix: "61551", yearRange: "2023 (Page)", note: "Facebook Page" },
  { prefix: "61552", yearRange: "2023-2024 (Page)", note: "Facebook Page" },
  { prefix: "61553", yearRange: "2024 (Page)", note: "Facebook Page" },
  { prefix: "61554", yearRange: "2024 (Page)", note: "Facebook Page" },
  { prefix: "61555", yearRange: "2024-2025 (Page)", note: "Facebook Page" },
  { prefix: "61556", yearRange: "2025 (Page)", note: "Facebook Page" },
  { prefix: "61557", yearRange: "2025 (Page)", note: "Facebook Page" },
];

export default function UidToYearTool() {
  const t = useTranslations("UidToYearTool");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});

  const estimateYearFromUid = useCallback((uid: string): { year: string; note: string } => {
    if (!uid || !/^\d+$/.test(uid)) {
      return { year: "Invalid UID", note: "ต้องเป็นตัวเลขเท่านั้น" };
    }

    // Very old accounts (UID < 100000000)
    if (uid.length < 9) {
      return { year: "2004-2009", note: "บัญชีเก่ามาก (Old Format)" };
    }

    // Old accounts (UID is 9-10 digits, not starting with 100)
    if (uid.length <= 10 && !uid.startsWith("100")) {
      return { year: "2006-2011", note: "บัญชีเก่า (Short UID)" };
    }

    // Match against known ranges (check longer prefixes first for specificity)
    const sortedRanges = [...UID_RANGES].sort((a, b) => b.prefix.length - a.prefix.length);
    
    for (const range of sortedRanges) {
      if (uid.startsWith(range.prefix)) {
        return { 
          year: range.yearRange, 
          note: range.note || "" 
        };
      }
    }

    // Fallback based on UID length
    if (uid.length >= 15 && uid.startsWith("100")) {
      return { year: "Recent (2020+)", note: "UID format ใหม่" };
    }

    return { year: "Unknown", note: "ไม่สามารถระบุปีได้" };
  }, []);

  const processUids = () => {
    const lines = input.split('\n').filter(line => line.trim() !== '');
    const yearCounts: Record<string, number> = {};
    
    const result = lines.map(line => {
      let uid = line.trim();
      
      // Extract UID from various formats
      const cUserMatch = line.match(/c_user[=:]\s*(\d+)/);
      const numMatch = line.match(/\b(\d{5,20})\b/);
      
      if (cUserMatch) {
        uid = cUserMatch[1];
      } else if (numMatch) {
        uid = numMatch[1];
      }

      const { year, note } = estimateYearFromUid(uid);
      
      // Count years for stats
      yearCounts[year] = (yearCounts[year] || 0) + 1;
      
      return `${uid} | ${year}${note ? ` (${note})` : ""}`;
    });

    setOutput(result.join('\n'));
    setStats(yearCounts);
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

  return (
    <div className="container mx-auto px-4 py-8 select-none max-w-5xl space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold flex items-center mb-2 bg-clip-text text-transparent bg-brand-gradient dark:from-white dark:to-slate-300">
          <Calendar className="w-8 h-8 mr-3 text-violet-500 dark:text-violet-400 animate-pulse-soft" />
          {t("title")}
        </h2>
        <p className="text-muted-foreground text-sm">{t("desc")}</p>
      </div>

      {/* Control Row */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white/40 dark:bg-[#0a1128]/45 p-4 rounded-2xl border border-white/10 dark:border-white/5 shadow-sm">
        <span className="text-xs font-bold text-muted-foreground pl-1">
          {input.split('\n').filter(line => line.trim() !== '').length} UIDs detected
        </span>
        <button
          onClick={processUids}
          className="flex items-center bg-brand-gradient text-white hover:opacity-90 px-6 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-violet-500/15 h-9 cursor-pointer ml-auto"
        >
          <Sparkles className="w-4 h-4 mr-2" /> {t("analyzeBtn")}
        </button>
      </div>

      {/* Stats Summary */}
      {Object.keys(stats).length > 0 && (
        <div className="bg-white/40 dark:bg-[#0a1128]/45 border border-white/10 dark:border-white/5 rounded-2xl p-5 shadow-sm space-y-3">
          <p className="text-xs font-extrabold text-foreground/80 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            {t("statsSummary")}
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats).sort().map(([year, count]) => (
              <span
                key={year}
                className="bg-white/60 dark:bg-[#131a30]/60 border border-white/20 dark:border-white/5 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-muted-foreground shadow-sm flex items-center space-x-1.5 transition-all hover:scale-105"
              >
                <span>{year}:</span>
                <span className="text-transparent bg-clip-text bg-brand-gradient dark:from-violet-400 dark:to-fuchsia-400 font-extrabold">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Editor Panel Card */}
      <div className="relative group/panel transition-all duration-300">
        <div className="absolute inset-0 bg-brand-gradient opacity-5 dark:opacity-10 blur-2xl rounded-3xl scale-[1.01] pointer-events-none" />
        <div className="absolute inset-0 bg-brand-gradient opacity-15 dark:opacity-25 rounded-3xl p-[1px] pointer-events-none" />
        <div className="relative bg-white/70 dark:bg-[#131a30]/70 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl rounded-3xl p-6 overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">{t("input")}</label>
                <button
                  onClick={() => { setInput(""); setStats({}); }}
                  className="text-[11px] font-bold flex items-center text-muted-foreground/80 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> {t("clear")}
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-96 p-4 bg-white/40 dark:bg-[#0a1128]/45 border border-border/80 dark:border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all rounded-2xl text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/30"
                placeholder={t("placeholder")}
              />
            </div>

            {/* Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">{t("output")}</label>
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
                    onClick={() => setOutput("")}
                    className="text-[11px] font-bold flex items-center text-muted-foreground/80 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> {t("clear")}
                  </button>
                </div>
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-96 p-4 bg-violet-500/5 dark:bg-[#0a1128]/25 border border-border/80 dark:border-white/10 rounded-2xl text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/20"
                placeholder={t("output")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="relative group/info overflow-hidden">
        <div className="absolute inset-0 bg-amber-500/5 dark:bg-amber-500/10 backdrop-blur-md rounded-2xl pointer-events-none" />
        <div className="relative p-5 border border-amber-500/20 rounded-2xl text-amber-700 dark:text-amber-300 flex items-start gap-3.5 shadow-sm">
          <Info className="w-5 h-5 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">{t("note")}</h4>
            <p className="text-xs leading-relaxed opacity-85 font-medium">
              {t("noteDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
