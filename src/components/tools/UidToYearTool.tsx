"use client";

import { useState, useCallback } from "react";
import { Copy, Trash2, Check, Calendar, Info, Search } from "lucide-react";
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
    <div className="mx-auto max-w-6xl select-none space-y-5">
      <div>
        <h2 className="mb-2 flex items-center text-2xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
          <span className="mr-3 grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/20">
            <Calendar className="h-5 w-5" />
          </span>
          {t("title")}
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">{t("desc")}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#111827]">
        <span className="pl-1 text-xs font-bold text-slate-500 dark:text-slate-400">
          {input.split('\n').filter(line => line.trim() !== '').length} UIDs detected
        </span>
        <button
          onClick={processUids}
          className="ml-auto flex h-9 cursor-pointer items-center rounded-lg border border-blue-600 bg-blue-600 px-4 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 active:scale-[0.99]"
        >
          <Search className="mr-2 h-4 w-4" /> {t("analyzeBtn")}
        </button>
      </div>

      {Object.keys(stats).length > 0 && (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111827]">
          <p className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-200">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
            {t("statsSummary")}
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats).sort().map(([year, count]) => (
              <span
                key={year}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                <span>{year}:</span>
                <span className="font-extrabold text-blue-700 dark:text-blue-300">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          <div className="border-b border-slate-200 p-4 dark:border-white/10 md:border-b-0 md:border-r">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{t("input")}</label>
                <button
                  onClick={() => { setInput(""); setStats({}); }}
                  className="flex cursor-pointer items-center text-[11px] font-bold text-slate-500 transition-colors hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> {t("clear")}
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-[420px] w-full resize-none rounded-lg border border-slate-200 bg-white p-4 font-mono text-sm leading-relaxed text-slate-950 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 dark:border-white/10 dark:bg-[#0b1020] dark:text-slate-50 dark:placeholder:text-slate-600"
                placeholder={t("placeholder")}
              />
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{t("output")}</label>
                <div className="flex gap-3.5">
                  <button
                    onClick={copyToClipboard}
                    disabled={!output}
                    className={`flex cursor-pointer items-center text-[11px] font-bold transition-colors disabled:pointer-events-none disabled:opacity-40 ${
                      copied ? "text-emerald-600 hover:text-emerald-700 dark:text-emerald-300" : "text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
                    }`}
                  >
                    {copied ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                    {copied ? t("copied") : t("copy")}
                  </button>
                  <button
                    onClick={() => setOutput("")}
                    className="flex cursor-pointer items-center text-[11px] font-bold text-slate-500 transition-colors hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> {t("clear")}
                  </button>
                </div>
              </div>
              <textarea
                value={output}
                readOnly
                className="h-[420px] w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-950 placeholder:text-slate-400 focus:outline-none dark:border-white/10 dark:bg-[#0b1020] dark:text-slate-50 dark:placeholder:text-slate-600"
                placeholder={t("output")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-300" />
        <div className="space-y-1">
          <h4 className="text-xs font-extrabold uppercase tracking-wide">{t("note")}</h4>
          <p className="text-xs font-medium leading-6">
            {t("noteDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}
