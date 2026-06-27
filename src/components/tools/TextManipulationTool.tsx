"use client";

import { useState } from "react";
import { Copy, Trash2, ArrowUpDown, ArrowDownAZ, ArrowDownZA, Type, Hash, Shuffle, FileEdit, Check, ArrowRightLeft, Search } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TextManipulationTool() {
  const t = useTranslations("Tool");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [copied, setCopied] = useState(false);

  // Tools
  const sortAZ = () => {
    setOutput(input.split("\n").sort().join("\n"));
  };

  const sortZA = () => {
    setOutput(input.split("\n").sort().reverse().join("\n"));
  };

  const removeDuplicates = () => {
    setOutput([...new Set(input.split("\n"))].join("\n"));
  };

  const removeEmptyLines = () => {
    setOutput(input.split("\n").filter((line) => line.trim() !== "").join("\n"));
  };

  const trimWhitespace = () => {
    setOutput(input.split("\n").map((line) => line.trim()).join("\n"));
  };

  const addPrefixSuffix = () => {
    setOutput(input.split("\n").map((line) => `${prefix}${line}${suffix}`).join("\n"));
  };

  const handleFindReplace = () => {
    if (!findText) return;
    setOutput(input.split(findText).join(replaceText));
  };

  const toUppercase = () => {
    setOutput(input.toUpperCase());
  };

  const toLowercase = () => {
    setOutput(input.toLowerCase());
  };

  const toTitleCase = () => {
    setOutput(
      input.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      )
    );
  };

  const reverseLines = () => {
    setOutput(input.split("\n").reverse().join("\n"));
  };

  const shuffleLines = () => {
    const lines = input.split("\n");
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    setOutput(lines.join("\n"));
  };

  const numberLines = () => {
    setOutput(input.split("\n").map((line, i) => `${i + 1}. ${line}`).join("\n"));
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const linesCount = input ? input.split("\n").length : 0;
  const wordsCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;

  return (
    <div className="container mx-auto px-4 py-8 select-none max-w-6xl">
      {/* Premium Gradient Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center mb-2 text-slate-950 dark:text-slate-50">
          <FileEdit className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-300 " />
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input Area Card */}
        <div className="relative group/card transition-all duration-300">
          <div className="relative flex flex-col h-full bg-white dark:bg-[#111827] rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-white/10">
            <div className="bg-white dark:bg-[#0b1020] px-4 py-3.5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
              <h2 className="font-semibold text-foreground text-sm">{t("inputText")}</h2>
              <div className="text-xs text-muted-foreground/80 flex space-x-3">
                <span>{t("lines")}: <strong className="text-blue-700 dark:text-blue-300">{linesCount}</strong></span>
                <span>{t("words")}: <strong className="text-blue-700 dark:text-blue-300">{wordsCount}</strong></span>
                <span>{t("chars")}: <strong className="text-blue-700 dark:text-blue-300">{charCount}</strong></span>
              </div>
            </div>
            <textarea
              className="w-full h-80 p-4 bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground/40 font-mono text-sm leading-relaxed"
              placeholder={t("placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Output Area Card */}
        <div className="relative group/card transition-all duration-300">
          <div className="relative flex flex-col h-full bg-white dark:bg-[#111827] rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-white/10">
            <div className="bg-white dark:bg-[#0b1020] px-4 py-3 flex justify-between items-center border-b border-slate-200 dark:border-white/10">
              <h2 className="font-semibold text-foreground text-sm">{t("outputResult")}</h2>
              <button
                onClick={handleCopy}
                disabled={!output}
                className={`text-xs flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold active:scale-95 cursor-pointer ${
                  copied 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm"
                    : "bg-brand-gradient text-white hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-blue-900/10"
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 " /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t("copied") : t("copy")}</span>
              </button>
            </div>
            <textarea
              className="w-full h-80 p-4 bg-slate-50 dark:bg-[#0b1020] border-none resize-none focus:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground/30 font-mono text-sm leading-relaxed"
              placeholder={t("resultPlaceholder")}
              value={output}
              readOnly
            ></textarea>
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="relative group/panel transition-all duration-300">
        <div className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm rounded-lg p-6 overflow-hidden">
          
          <h3 className="text-lg font-extrabold mb-5 border-b border-slate-200 dark:border-white/10 pb-3 text-slate-950 dark:text-slate-50 flex items-center">
            <Hash className="w-5 h-5 mr-2 text-blue-600" />
            {t("tools")}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
            {/* Sorting Box */}
            <div className="bg-slate-50 dark:bg-[#0b1020] border border-slate-200 dark:border-white/10 p-4 rounded-lg space-y-3.5 shadow-sm">
              <p className="text-sm font-extrabold text-foreground flex items-center border-b border-slate-200 dark:border-white/10 pb-2">
                <ArrowUpDown className="w-4 h-4 mr-2 text-blue-600" /> {t("sorting")}
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={sortAZ} className="tool-btn"><ArrowDownAZ className="w-4 h-4 mr-2 text-blue-600/70" /> <span>{t("sortAz")}</span></button>
                <button onClick={sortZA} className="tool-btn"><ArrowDownZA className="w-4 h-4 mr-2 text-blue-600/70" /> <span>{t("sortZa")}</span></button>
                <button onClick={reverseLines} className="tool-btn"><ArrowUpDown className="w-4 h-4 mr-2 text-blue-600/70" /> <span>{t("reverse")}</span></button>
                <button onClick={shuffleLines} className="tool-btn"><Shuffle className="w-4 h-4 mr-2 text-blue-600/70" /> <span>{t("shuffle")}</span></button>
              </div>
            </div>

            {/* Cleaning Box */}
            <div className="bg-slate-50 dark:bg-[#0b1020] border border-slate-200 dark:border-white/10 p-4 rounded-lg space-y-3.5 shadow-sm">
              <p className="text-sm font-extrabold text-foreground flex items-center border-b border-slate-200 dark:border-white/10 pb-2">
                <Trash2 className="w-4 h-4 mr-2 text-blue-600" /> {t("cleaning")}
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={removeDuplicates} className="tool-btn"><Copy className="w-4 h-4 mr-2 text-blue-600/70" /> <span>{t("removeDuplicates")}</span></button>
                <button onClick={removeEmptyLines} className="tool-btn"><FileEdit className="w-4 h-4 mr-2 text-blue-600/70" /> <span>{t("removeEmptyLines")}</span></button>
                <button onClick={trimWhitespace} className="tool-btn"><Type className="w-4 h-4 mr-2 text-blue-600/70" /> <span>{t("trimWhitespace")}</span></button>
              </div>
            </div>

            {/* Formatting Box */}
            <div className="bg-slate-50 dark:bg-[#0b1020] border border-slate-200 dark:border-white/10 p-4 rounded-lg space-y-3.5 shadow-sm">
              <p className="text-sm font-extrabold text-foreground flex items-center border-b border-slate-200 dark:border-white/10 pb-2">
                <Type className="w-4 h-4 mr-2 text-blue-600" /> {t("formatting")}
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={toUppercase} className="tool-btn"><Type className="w-4 h-4 mr-2 text-blue-600/70" /> <span>{t("upper")}</span></button>
                <button onClick={toLowercase} className="tool-btn"><Type className="w-4 h-4 mr-2 text-blue-600/70" /> <span>{t("lower")}</span></button>
                <button onClick={toTitleCase} className="tool-btn"><Type className="w-4 h-4 mr-2 text-blue-600/70" /> <span>{t("titleCase")}</span></button>
                <button onClick={numberLines} className="tool-btn"><Hash className="w-4 h-4 mr-2 text-blue-600/70" /> <span>{t("numberLines")}</span></button>
              </div>
            </div>

            {/* Other Actions Box */}
            <div className="bg-slate-50 dark:bg-[#0b1020] border border-slate-200 dark:border-white/10 p-4 rounded-lg space-y-3.5 shadow-sm">
              <p className="text-sm font-extrabold text-foreground flex items-center border-b border-slate-200 dark:border-white/10 pb-2">
                <FileEdit className="w-4 h-4 mr-2 text-blue-600" /> {t("otherActions")}
              </p>
              <div className="flex flex-col gap-3.5 pt-1">
                <button onClick={() => setInput(output)} className="flex items-center justify-center px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-lg text-[13px] font-bold transition-all active:scale-95 w-full cursor-pointer shadow-sm">
                  <ArrowRightLeft className="w-4 h-4 mr-2" /> <span>{t("moveOutput")}</span>
                </button>
                <button onClick={clearAll} className="flex items-center justify-center px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-lg text-[13px] font-bold transition-all active:scale-95 w-full cursor-pointer shadow-sm">
                  <Trash2 className="w-4 h-4 mr-2" /> <span>{t("clearAll")}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-white/10">
            {/* Prefix / Suffix Box */}
            <div className="flex flex-col space-y-3 bg-slate-50 dark:bg-[#0b1020] p-4 rounded-lg border border-slate-200 dark:border-white/10">
              <p className="text-sm font-extrabold text-foreground flex items-center"><Hash className="w-4 h-4 mr-2 text-blue-600" /> {t("prefixSuffix")}</p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  placeholder={t("prefix")}
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg text-sm focus:outline-none text-foreground placeholder:text-muted-foreground/40 font-semibold"
                />
                <input
                  type="text"
                  placeholder={t("suffix")}
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg text-sm focus:outline-none text-foreground placeholder:text-muted-foreground/40 font-semibold"
                />
                <button onClick={addPrefixSuffix} className="bg-brand-gradient text-white hover:opacity-90 px-5 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95 whitespace-nowrap shadow-md shadow-blue-900/10 cursor-pointer">
                  {t("apply")}
                </button>
              </div>
            </div>

            {/* Find & Replace Box */}
            <div className="flex flex-col space-y-3 bg-slate-50 dark:bg-[#0b1020] p-4 rounded-lg border border-slate-200 dark:border-white/10">
              <p className="text-sm font-extrabold text-foreground flex items-center"><Search className="w-4 h-4 mr-2 text-blue-600" /> {t("findReplace")}</p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  placeholder={t("find")}
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg text-sm focus:outline-none text-foreground placeholder:text-muted-foreground/40 font-semibold"
                />
                <input
                  type="text"
                  placeholder={t("replaceWith")}
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-[#0b1020] border border-border/80 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all rounded-lg text-sm focus:outline-none text-foreground placeholder:text-muted-foreground/40 font-semibold"
                />
                <button onClick={handleFindReplace} className="bg-brand-gradient text-white hover:opacity-90 px-5 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95 whitespace-nowrap shadow-md shadow-blue-900/10 cursor-pointer">
                  {t("replaceBtn")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .tool-btn {
          @apply flex items-center justify-start px-4 py-2.5 bg-white dark:bg-[#0b1020] border border-slate-200 dark:border-white/10 rounded-lg text-[13px] hover:bg-slate-50 dark:hover:bg-white/5 text-foreground transition-all active:scale-95 w-full font-semibold shadow-sm cursor-pointer;
        }
      `}</style>
    </div>
  );
}
