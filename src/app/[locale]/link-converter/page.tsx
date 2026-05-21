"use client";

import { useState } from "react";
import { Link2, Copy, Check, ExternalLink, ArrowRight, Shield, Zap, Globe, Scissors } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LinkConverterPage() {
  const t = useTranslations("LinkConverter");
  const [inputUrl, setInputUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [bypassUrl, setBypassUrl] = useState("");
  const [copiedShort, setCopiedShort] = useState(false);
  const [copiedBypass, setCopiedBypass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setError("");
    setCopiedShort(false);
    setCopiedBypass(false);
    setShortUrl("");
    setBypassUrl("");

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

    const baseUrl = window.location.origin;

    // 1. Generate bypass URL immediately
    const bypass = `${baseUrl}/api/r?url=${encodeURIComponent(url)}`;
    setBypassUrl(bypass);

    // 2. Try to shorten automatically
    setLoading(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok && data.shortUrl) {
        setShortUrl(`${baseUrl}${data.shortUrl}`);
      }
      // If shorten fails, we still have the bypass URL — no error needed
    } catch {
      // Network error — bypass URL is still available
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, type: "short" | "bypass") => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }

    if (type === "short") {
      setCopiedShort(true);
      setTimeout(() => setCopiedShort(false), 2500);
    } else {
      setCopiedBypass(true);
      setTimeout(() => setCopiedBypass(false), 2500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConvert();
    }
  };

  const hasResult = bypassUrl || shortUrl;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4 shadow-lg">
          <Link2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">{t("description")}</p>
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
            {t("convertBtn")}
          </button>
        </div>

        {error && (
          <p className="text-destructive text-sm mt-2">{error}</p>
        )}

        {/* Results */}
        {hasResult && (
          <div className="mt-5 space-y-4">

            {/* Short URL (primary result) */}
            {shortUrl && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-purple-500" />
                  {t("shortenResultLabel")}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={shortUrl}
                    readOnly
                    className="flex-grow bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 rounded-lg px-4 py-3 text-sm font-mono select-all w-full"
                  />
                  <button
                    onClick={() => handleCopy(shortUrl, "short")}
                    className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all shrink-0 w-full sm:w-auto ${
                      copiedShort
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                    }`}
                  >
                    {copiedShort ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copiedShort ? t("copied") : t("copyBtn")}
                  </button>
                </div>
              </div>
            )}

            {/* Bypass URL (secondary / fallback) */}
            {bypassUrl && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Link2 className="w-4 h-4" />
                  {t("resultLabel")}
                  {shortUrl && <span className="text-xs bg-muted px-2 py-0.5 rounded-full">Fallback</span>}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={bypassUrl}
                    readOnly
                    className="flex-grow bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm font-mono select-all w-full"
                  />
                  <button
                    onClick={() => handleCopy(bypassUrl, "bypass")}
                    className={`flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all shrink-0 w-full sm:w-auto ${
                      copiedBypass
                        ? "bg-green-500 text-white"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                    }`}
                  >
                    {copiedBypass ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copiedBypass ? t("copied") : t("copyBtn")}
                  </button>
                </div>
              </div>
            )}

            <a
              href={shortUrl || bypassUrl}
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
