"use client";

import { useState } from "react";
import { Copy, Trash2, FileJson, AlertCircle, Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default function JsonTool() {
  const t = useTranslations("JsonTool");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      setError(null);
      if (!input.trim()) {
        setOutput("");
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
    }
  };

  const minifyJson = () => {
    try {
      setError(null);
      if (!input.trim()) {
        setOutput("");
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
    }
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
          <h2 className="text-3xl font-extrabold flex items-center mb-2 bg-clip-text text-transparent bg-brand-gradient dark:from-white dark:to-slate-300">
            <FileJson className="w-8 h-8 mr-3 text-violet-500 dark:text-violet-400 animate-pulse-soft" />
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-sm">{t("desc")}</p>
        </div>

        {/* Buttons Header Area */}
        <div className="flex items-center gap-2.5">
          <button onClick={formatJson} className="flex items-center bg-brand-gradient text-white hover:opacity-90 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-violet-500/15 h-9.5 cursor-pointer">
            <FileJson className="w-4 h-4 mr-1.5" /> {t("formatBtn")}
          </button>
          <button onClick={minifyJson} className="flex items-center px-4 py-2.5 bg-white/50 hover:bg-white/80 dark:bg-[#1c2541]/40 dark:hover:bg-[#1c2541]/60 text-foreground border border-white/10 dark:border-white/5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm h-9.5 cursor-pointer">
            {t("minifyBtn")}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center p-3.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-4.5 h-4.5 mr-2 flex-shrink-0 text-rose-500" />
          {error}
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
                  onClick={() => { setInput(""); setError(null); }}
                  className="text-[11px] font-bold flex items-center text-muted-foreground/80 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> {t("clear")}
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-[450px] p-4 bg-white/40 dark:bg-[#0a1128]/45 border border-border/80 dark:border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all rounded-2xl text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/30"
                placeholder="{}"
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
                className="w-full h-[450px] p-4 bg-violet-500/5 dark:bg-[#0a1128]/25 border border-border/80 dark:border-white/10 rounded-2xl text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/20"
                placeholder="Result..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
