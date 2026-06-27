"use client";

import { useState } from "react";
import { Copy, Trash2, Code2, Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HtmlExtractorTool() {
  const t = useTranslations("HtmlExtractorTool");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"image" | "link">("image");
  const [copied, setCopied] = useState(false);

  const processHtml = () => {
    const results: string[] = [];
    
    if (mode === "image") {
      const regex = /<img[^>]+src=(["'])(.*?)\1/g;
      let match;
      while ((match = regex.exec(input)) !== null) {
        results.push(match[2]);
      }
    } else {
      const regex = /<a[^>]+href=(["'])(.*?)\1/g;
      let match;
      while ((match = regex.exec(input)) !== null) {
        results.push(match[2]);
      }
    }

    setOutput(results.join('\n'));
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
          <Code2 className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-300 " />
          {t("title")}
        </h2>
        <p className="text-muted-foreground text-sm">{t("desc")}</p>
      </div>

      {/* Control Actions Row */}
      <div className="flex flex-wrap gap-4 items-end bg-white dark:bg-[#0b1020] p-4 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="space-y-1.5 flex flex-col">
          <label className="text-xs font-extrabold text-foreground/80 pl-1">{t("target")}</label>
          <select 
            value={mode}
            onChange={(e) => setMode(e.target.value as "image" | "link")}
            className="w-48 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg px-3 py-2 text-sm focus:outline-none text-foreground font-bold cursor-pointer"
          >
            <option value="image" className="dark:bg-[#131a30] text-foreground font-semibold">{t("extractImages")}</option>
            <option value="link" className="dark:bg-[#131a30] text-foreground font-semibold">{t("extractLinks")}</option>
          </select>
        </div>
        
        <button onClick={processHtml} className="flex items-center bg-brand-gradient text-white hover:opacity-90 px-6 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-md shadow-blue-900/10 h-9 cursor-pointer ml-auto">
          <Code2 className="w-4 h-4 mr-2" /> {t("extractBtn")}
        </button>
      </div>

      {/* Editor Panel Card */}
      <div className="relative group/panel transition-all duration-300">
        <div className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm rounded-lg p-6 overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">{t("inputHtml")}</label>
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
                className="w-full h-[400px] p-4 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/30"
                placeholder={t("placeholder")}
              />
            </div>

            {/* Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">
                  {t("extractedUrls")} <span className="text-blue-600 font-mono">({output.split('\n').filter(Boolean).length})</span>
                </label>
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
                placeholder={t("outputPlaceholder")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
