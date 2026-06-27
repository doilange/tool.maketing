"use client";

import { useState } from "react";
import { Copy, Trash2, ArrowRightLeft, Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ReverseTextTool() {
  const t = useTranslations("ReverseTextTool");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"words" | "characters" | "lines">("words");
  const [copied, setCopied] = useState(false);

  const processReverse = () => {
    let result = "";
    
    if (mode === "words") {
      result = input.split('\n').map(line => 
        line.split(' ').reverse().join(' ')
      ).join('\n');
    } else if (mode === "characters") {
      result = input.split('\n').map(line => 
        line.split('').reverse().join('')
      ).join('\n');
    } else if (mode === "lines") {
      result = input.split('\n').reverse().join('\n');
    }
    
    setOutput(result);
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
        <h2 className="text-3xl font-extrabold flex items-center mb-2 text-slate-950 dark:text-slate-50">
          <ArrowRightLeft className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-300 " />
          {t("title")}
        </h2>
        <p className="text-muted-foreground text-sm">{t("desc")}</p>
      </div>

      {/* Mode Controls Row */}
      <div className="flex flex-wrap gap-4 items-end bg-white dark:bg-[#0b1020] p-4 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="space-y-1.5 flex flex-col">
          <label className="text-xs font-extrabold text-foreground/80 pl-1">Mode</label>
          <select 
            value={mode}
            onChange={(e) => setMode(e.target.value as "words" | "characters" | "lines")}
            className="w-48 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg px-3 py-2 text-sm focus:outline-none text-foreground font-bold cursor-pointer"
          >
            <option value="words" className="dark:bg-[#131a30] text-foreground font-semibold">{t("modeWords")}</option>
            <option value="characters" className="dark:bg-[#131a30] text-foreground font-semibold">{t("modeChars")}</option>
            <option value="lines" className="dark:bg-[#131a30] text-foreground font-semibold">{t("modeLines")}</option>
          </select>
        </div>
        
        <button onClick={processReverse} className="flex items-center bg-brand-gradient text-white hover:opacity-90 px-6 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-md shadow-blue-900/10 h-9 cursor-pointer ml-auto">
          <ArrowRightLeft className="w-4 h-4 mr-2" /> {t("reverseBtn")}
        </button>
      </div>

      {/* Editor Panel Card */}
      <div className="relative group/panel transition-all duration-300">
        <div className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm rounded-lg p-6 overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">{t("input")}</label>
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
                className="w-full h-96 p-4 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/30"
                placeholder="Paste your text here..."
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
                className="w-full h-96 p-4 bg-slate-50 dark:bg-[#0b1020] border border-border/80 dark:border-white/10 rounded-lg text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/20"
                placeholder="Result will appear here..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
