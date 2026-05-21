"use client";

import { useState } from "react";
import { Link2, Copy, Check, ExternalLink, ArrowRight, Shield, Zap, Globe, Scissors } from "lucide-react";
import { useTranslations } from "next-intl";

type Mode = "bypass" | "shorten";

export default function LinkConverterPage() {
  const t = useTranslations("LinkConverter");
  const [mode, setMode] = useState<Mode>("bypass");
  const [inputUrl, setInputUrl] = useState("");
  const [convertedUrl, setConvertedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setError("");
    setCopied(false);
    setConvertedUrl("");

    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setError(t("errorEmpty"));
      return;
    }

    // Auto-add https:// if missing
    let url = trimmed;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      setError(t("errorInvalid"));
      return;
    }

    if (mode === "bypass") {
      const baseUrl = window.location.origin;
      const result = `${baseUrl}/api/r?url=${encodeURIComponent(url)}`;
      setConvertedUrl(result);
    } else {
      // Shorten mode — call the API
      setLoading(true);
      try {
        const res = await fetch("/api/shorten", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to shorten URL");
          return;
        }
        const baseUrl = window.location.origin;
        setConvertedUrl(`${baseUrl}${data.shortUrl}`);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(convertedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = convertedUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConvert();
    }
  };

  const switchMode = (newMode: Mode) => {
    if (newMode !== mode) {
      setMode(newMode);
      setConvertedUrl("");
      setError("");
      setCopied(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4 shadow-lg">
          {mode === "bypass" ? <Link2 className="w-8 h-8" /> : <Scissors className="w-8 h-8" />}
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {mode === "bypass" ? t("title") : t("shortenTitle")}
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {mode === "bypass" ? t("description") : t("shortenDesc")}
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-muted rounded-xl p-1 gap-1">
          <button
            onClick={() => switchMode("bypass")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "bypass"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link2 className="w-4 h-4" />
            {t("modeBypass")}
          </button>
          <button
            onClick={() => switchMode("shorten")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "shorten"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Scissors className="w-4 h-4" />
            {t("modeShorten")}
          </button>
        </div>
      </div>

      {/* Converter Box */}
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 mb-6">
        <label className="text-sm font-medium mb-2 block">{t("inputLabel")}</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => { setInputUrl(e.target.value); setError(""); }}
            onKeyDown={handleKeyDown}
            placeholder={t("inputPlaceholder")}
            className="flex-grow bg-background border border-input rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
          <button
            onClick={handleConvert}
            disabled={loading}
            className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg font-medium transition-all shadow-sm hover:shadow-md shrink-0 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <ArrowRight className="w-4 h-4 mr-2" />
            )}
            {mode === "bypass" ? t("convertBtn") : t("shortenBtn")}
          </button>
        </div>

        {error && (
          <p className="text-destructive text-sm mt-2">{error}</p>
        )}

        {/* Result */}
        {convertedUrl && (
          <div className="mt-5 space-y-3">
            <label className="text-sm font-medium block">
              {mode === "bypass" ? t("resultLabel") : t("shortenResultLabel")}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={convertedUrl}
                readOnly
                className="flex-grow bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm font-mono select-all w-full"
              />
              <button
                onClick={handleCopy}
                className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all shrink-0 w-full sm:w-auto ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? t("copied") : t("copyBtn")}
              </button>
            </div>
            <a
              href={convertedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {t("testLink")}
            </a>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <Shield className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <h3 className="text-sm font-semibold mb-1">{t("feature1Title")}</h3>
          <p className="text-xs text-muted-foreground">{t("feature1Desc")}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-amber-500" />
          <h3 className="text-sm font-semibold mb-1">{t("feature2Title")}</h3>
          <p className="text-xs text-muted-foreground">{t("feature2Desc")}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <Globe className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
          <h3 className="text-sm font-semibold mb-1">{t("feature3Title")}</h3>
          <p className="text-xs text-muted-foreground">{t("feature3Desc")}</p>
        </div>
      </div>
    </div>
  );
}
