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
          <h2 className="text-3xl font-extrabold flex items-center mb-2 text-slate-950 dark:text-slate-50">
            <FileJson className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-300 " />
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-sm">{t("desc")}</p>
        </div>

        {/* Buttons Header Area */}
        <div className="flex items-center gap-2.5">
          <button onClick={formatJson} className="flex items-center bg-brand-gradient text-white hover:opacity-90 px-4 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-md shadow-blue-900/10 h-9.5 cursor-pointer">
            <FileJson className="w-4 h-4 mr-1.5" /> {t("formatBtn")}
          </button>
          <button onClick={minifyJson} className="flex items-center px-4 py-2.5 bg-white hover:bg-slate-50 dark:bg-[#0b1020] dark:hover:bg-white/5 text-foreground border border-slate-200 dark:border-white/10 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-sm h-9.5 cursor-pointer">
            {t("minifyBtn")}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center p-3.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg  animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-4.5 h-4.5 mr-2 flex-shrink-0 text-rose-500" />
          {error}
        </div>
      )}

      {/* Editor Panel Card */}
      <div className="relative group/panel transition-all duration-300">
        <div className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm rounded-lg p-6 overflow-hidden">
          
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
                className="w-full h-[450px] p-4 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/30"
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
                className="w-full h-[450px] p-4 bg-slate-50 dark:bg-[#0b1020] border border-border/80 dark:border-white/10 rounded-lg text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/20"
                placeholder="Result..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
