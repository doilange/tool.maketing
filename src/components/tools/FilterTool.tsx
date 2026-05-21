"use client";

import { useState } from "react";
import { Copy, Trash2, Filter, Check, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FilterTool() {
  const t = useTranslations("FilterTool");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [mode, setMode] = useState<"include" | "exclude">("include");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [copied, setCopied] = useState(false);

  const processFilter = () => {
    if (!filterKeyword) {
      setOutput(input);
      return;
    }

    const lines = input.split('\n');
    const keyword = caseSensitive ? filterKeyword : filterKeyword.toLowerCase();

    const result = lines.filter(line => {
      const targetLine = caseSensitive ? line : line.toLowerCase();
      const hasKeyword = targetLine.includes(keyword);
      return mode === "include" ? hasKeyword : !hasKeyword;
    });

    setOutput(result.join('\n'));
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
          <Filter className="w-8 h-8 mr-3 text-violet-500 dark:text-violet-400 animate-pulse-soft" />
          {t("title")}
        </h2>
        <p className="text-muted-foreground text-sm">{t("desc")}</p>
      </div>

      {/* Control Actions Panel */}
      <div className="flex flex-wrap gap-4 items-end bg-white/40 dark:bg-[#0a1128]/45 p-4 rounded-2xl border border-white/10 dark:border-white/5 shadow-sm">
        <div className="space-y-1.5 flex flex-col">
          <label className="text-xs font-extrabold text-foreground/80 pl-1">{t("keyword")}</label>
          <input
            type="text"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            className="w-48 bg-white/40 dark:bg-[#0a1128]/45 border border-border/80 dark:border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all rounded-xl px-3 py-2 text-sm focus:outline-none text-foreground font-semibold placeholder:text-muted-foreground/30 placeholder:font-normal"
            placeholder="Text to filter..."
          />
        </div>

        <div className="space-y-1.5 flex flex-col">
          <label className="text-xs font-extrabold text-foreground/80 pl-1">{t("mode")}</label>
          <select 
            value={mode}
            onChange={(e) => setMode(e.target.value as "include" | "exclude")}
            className="w-32 bg-white/40 dark:bg-[#0a1128]/45 border border-border/80 dark:border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all rounded-xl px-3 py-2 text-sm focus:outline-none text-foreground font-bold cursor-pointer"
          >
            <option value="include" className="dark:bg-[#131a30] text-foreground font-semibold">{t("include")}</option>
            <option value="exclude" className="dark:bg-[#131a30] text-foreground font-semibold">{t("exclude")}</option>
          </select>
        </div>

        <div className="flex items-center space-x-2.5 h-9 pb-2 cursor-pointer select-none">
          <input
            type="checkbox"
            id="case-sensitive"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded border-border/80 text-violet-600 focus:ring-violet-500/10 bg-white/40 dark:bg-[#0a1128]/45 h-4.5 w-4.5 transition-all focus:outline-none cursor-pointer"
          />
          <label htmlFor="case-sensitive" className="text-xs font-bold text-foreground cursor-pointer">{t("caseSensitive")}</label>
        </div>
        
        <button onClick={processFilter} className="flex items-center bg-brand-gradient text-white hover:opacity-90 px-6 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-violet-500/15 h-9 cursor-pointer ml-auto">
          <Filter className="w-4 h-4 mr-2" /> {t("filterBtn")}
        </button>
      </div>

      {/* Editor Main Card */}
      <div className="relative group/panel transition-all duration-300">
        <div className="absolute inset-0 bg-brand-gradient opacity-5 dark:opacity-10 blur-2xl rounded-3xl scale-[1.01] pointer-events-none" />
        <div className="absolute inset-0 bg-brand-gradient opacity-15 dark:opacity-25 rounded-3xl p-[1px] pointer-events-none" />
        <div className="relative bg-white/70 dark:bg-[#131a30]/70 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl rounded-3xl p-6 overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">{t("input")} <span className="text-violet-500 font-mono">({input.split('\n').filter(Boolean).length})</span></label>
                <button
                  onClick={() => setInput("")}
                  className="text-[11px] font-bold flex items-center text-muted-foreground/80 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> {t("clear")}
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-[400px] p-4 bg-white/40 dark:bg-[#0a1128]/45 border border-border/80 dark:border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all rounded-2xl text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/30"
                placeholder="Paste your text here..."
              />
            </div>

            {/* Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">{t("output")} <span className="text-violet-500 font-mono">({output.split('\n').filter(Boolean).length})</span></label>
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
                className="w-full h-[400px] p-4 bg-violet-500/5 dark:bg-[#0a1128]/25 border border-border/80 dark:border-white/10 rounded-2xl text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/20"
                placeholder="Result will appear here..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
