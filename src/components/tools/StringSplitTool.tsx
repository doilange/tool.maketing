"use client";

import { useState } from "react";
import { Copy, Trash2, Scissors, Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default function StringSplitTool() {
  const t = useTranslations("StringSplitTool");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"column" | "chunk">("column");
  const [copied, setCopied] = useState(false);
  
  // For 'column' mode
  const [delimiter, setDelimiter] = useState("|");
  const [columnIndex, setColumnIndex] = useState(1);
  
  // For 'chunk' mode
  const [linesPerChunk, setLinesPerChunk] = useState(10);
  const [chunkSeparator, setChunkSeparator] = useState("====================");

  const processSplit = () => {
    const lines = input.split('\n').filter(line => line.trim() !== '');
    
    if (mode === "column") {
      const result = lines.map(line => {
        const parts = line.split(delimiter);
        // 1-indexed to 0-indexed
        const index = Math.max(0, columnIndex - 1);
        return parts[index] || "";
      });
      setOutput(result.join('\n'));
    } else if (mode === "chunk") {
      const chunks = [];
      for (let i = 0; i < lines.length; i += linesPerChunk) {
        chunks.push(lines.slice(i, i + linesPerChunk).join('\n'));
      }
      setOutput(chunks.join(`\n${chunkSeparator}\n`));
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
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold flex items-center mb-2 text-slate-950 dark:text-slate-50">
          <Scissors className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-300 " />
          {t("title")}
        </h2>
        <p className="text-muted-foreground text-sm">{t("desc")}</p>
      </div>

      {/* Mode / Options Bar */}
      <div className="flex flex-wrap gap-4 items-end bg-white dark:bg-[#0b1020] p-4 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="space-y-1.5 flex flex-col">
          <label className="text-xs font-extrabold text-foreground/80 pl-1">{t("operationMode")}</label>
          <select 
            value={mode}
            onChange={(e) => setMode(e.target.value as "column" | "chunk")}
            className="w-48 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg px-3 py-2 text-sm focus:outline-none text-foreground font-bold cursor-pointer"
          >
            <option value="column" className="dark:bg-[#131a30] text-foreground font-semibold">{t("extractColumn")}</option>
            <option value="chunk" className="dark:bg-[#131a30] text-foreground font-semibold">{t("splitIntoChunks")}</option>
          </select>
        </div>

        {mode === "column" ? (
          <>
            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-extrabold text-foreground/80 pl-1">{t("delimiter")}</label>
              <input
                type="text"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="w-24 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg px-3 py-2 text-sm focus:outline-none text-foreground font-bold text-center font-mono"
                placeholder="e.g. |"
              />
            </div>
            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-extrabold text-foreground/80 pl-1">{t("columnIndex")}</label>
              <input
                type="number"
                min="1"
                value={columnIndex}
                onChange={(e) => setColumnIndex(parseInt(e.target.value) || 1)}
                className="w-24 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg px-3 py-2 text-sm focus:outline-none text-foreground font-bold text-center font-mono"
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-extrabold text-foreground/80 pl-1">{t("linesPerChunk")}</label>
              <input
                type="number"
                min="1"
                value={linesPerChunk}
                onChange={(e) => setLinesPerChunk(parseInt(e.target.value) || 10)}
                className="w-32 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg px-3 py-2 text-sm focus:outline-none text-foreground font-bold text-center font-mono"
              />
            </div>
            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-extrabold text-foreground/80 pl-1">{t("separator")}</label>
              <input
                type="text"
                value={chunkSeparator}
                onChange={(e) => setChunkSeparator(e.target.value)}
                className="w-48 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg px-3 py-2 text-sm focus:outline-none text-foreground font-bold font-mono"
              />
            </div>
          </>
        )}
        
        <button onClick={processSplit} className="flex items-center bg-brand-gradient text-white hover:opacity-90 px-6 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-md shadow-blue-900/10 h-9 cursor-pointer ml-auto">
          <Scissors className="w-4 h-4 mr-2" /> {t("splitBtn")}
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
                placeholder={t("outputPlaceholder")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
