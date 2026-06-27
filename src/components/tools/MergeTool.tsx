"use client";

import { useState } from "react";
import { Copy, Trash2, Combine, Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MergeTool() {
  const t = useTranslations("MergeTool");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [output, setOutput] = useState("");
  const [separator, setSeparator] = useState("|");
  const [copied, setCopied] = useState(false);

  const processMerge = () => {
    const lines1 = input1.split('\n');
    const lines2 = input2.split('\n');
    const maxLength = Math.max(lines1.length, lines2.length);
    const result = [];

    for (let i = 0; i < maxLength; i++) {
      const part1 = lines1[i] || "";
      const part2 = lines2[i] || "";
      if (part1 && part2) {
        result.push(`${part1}${separator}${part2}`);
      } else if (part1) {
        result.push(part1);
      } else if (part2) {
        result.push(part2);
      }
    }

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
        <h2 className="text-3xl font-extrabold flex items-center mb-2 text-slate-950 dark:text-slate-50">
          <Combine className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-300 " />
          {t("title")}
        </h2>
        <p className="text-muted-foreground text-sm">{t("desc")}</p>
      </div>

      {/* Selector Control */}
      <div className="flex flex-wrap gap-4 items-end bg-white dark:bg-[#0b1020] p-4 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="space-y-1.5 flex flex-col">
          <label className="text-xs font-extrabold text-foreground/80 pl-1">{t("separator")}</label>
          <input
            type="text"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="w-32 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg px-3 py-2 text-sm focus:outline-none text-foreground font-semibold placeholder:text-muted-foreground/30 text-center font-mono"
            placeholder="e.g. |"
          />
        </div>
        
        <button onClick={processMerge} className="flex items-center bg-brand-gradient text-white hover:opacity-90 px-6 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-md shadow-blue-900/10 h-9 cursor-pointer ml-auto">
          <Combine className="w-4 h-4 mr-2" /> {t("mergeBtn")}
        </button>
      </div>

      {/* Editor columns card */}
      <div className="relative group/panel transition-all duration-300">
        <div className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm rounded-lg p-6 overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* List 1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">{t("list1")}</label>
              </div>
              <textarea
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                className="w-full h-[400px] p-4 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/30"
                placeholder={t("placeholder1")}
              />
            </div>

            {/* List 2 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">{t("list2")}</label>
                <button
                  onClick={() => { setInput1(""); setInput2(""); setOutput(""); }}
                  className="text-[11px] font-bold flex items-center text-muted-foreground/80 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> {t("clearAll")}
                </button>
              </div>
              <textarea
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                className="w-full h-[400px] p-4 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/30"
                placeholder={t("placeholder2")}
              />
            </div>

            {/* Output */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-extrabold text-foreground">{t("mergedOutput")}</label>
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
