"use client";

import { useState } from "react";
import { Copy, Trash2, Check, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DuplicateFilterTool() {
  const t = useTranslations("DuplicateFilterTool");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const processDuplicates = () => {
    const lines = input.split('\n');
    const uniqueLines = Array.from(new Set(lines));
    
    setDuplicateCount(lines.length - uniqueLines.length);
    setOutput(uniqueLines.join('\n'));
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
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center mb-2 text-slate-950 dark:text-slate-50">
            <Sparkles className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-300 " />
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-sm">{t("desc")}</p>
        </div>

        {/* Action Button & Status */}
        <div className="flex items-center gap-3">
          <button onClick={processDuplicates} className="bg-brand-gradient text-white hover:opacity-90 px-5 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-md shadow-blue-900/10 cursor-pointer">
            {t("removeBtn")}
          </button>
          {duplicateCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold animate-in fade-in zoom-in-95 duration-200">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>{t("removedMsg", { count: duplicateCount })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Glass Panel wrapper */}
      <div className="relative group/panel transition-all duration-300">
        <div className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm rounded-lg p-6 overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">{t("input")} <span className="text-blue-600 font-mono">({input.split('\n').filter(Boolean).length})</span></label>
                <button
                  onClick={() => { setInput(""); setDuplicateCount(0); }}
                  className="text-[11px] font-bold flex items-center text-muted-foreground/80 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> {t("clear")}
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-[400px] p-4 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/30"
                placeholder="Paste your text here..."
              />
            </div>

            {/* Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">{t("output")} <span className="text-blue-600 font-mono">({output.split('\n').filter(Boolean).length})</span></label>
                <div className="flex space-x-3.5">
                  <button
                    onClick={copyToClipboard}
                    disabled={!output}
                    className={`text-[11px] font-bold flex items-center transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${
                      copied ? "text-emerald-500 hover:text-emerald-600" : "text-blue-600 hover:text-blue-700"
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
                className="w-full h-[400px] p-4 bg-slate-50 dark:bg-[#0b1020] border border-border/80 dark:border-white/10 rounded-lg text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/20"
                placeholder="Result will appear here..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
