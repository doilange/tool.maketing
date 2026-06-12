"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, Languages, LayoutDashboard, Wrench, Link2, Globe, Search, Download, FileText, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";

export function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Hide the global navbar after all hooks have run so route changes keep hook order stable.
  if (pathname.includes("content-planner")) {
    return null;
  }

  const navItems = [
    { href: "/content-planner", name: t("contentPlanner"), icon: LayoutDashboard },
    { href: "/tool", name: t("tool"), icon: Wrench },
    { href: "/link-converter", name: t("linkConverter"), icon: Link2 },
    { href: "/check-ip", name: t("checkIp"), icon: Globe },
    { href: "/check-uid", name: t("checkUid"), icon: Search },
    { href: "/get-uid", name: t("getUid"), icon: Download },
    { href: "/notepad", name: t("notepad"), icon: FileText },
    { href: "/faq", name: t("faq"), icon: HelpCircle },
  ];

  // Helper to check if a path is active
  const isActivePath = (itemHref: string) => {
    return pathname === itemHref;
  };

  const toggleLanguage = () => {
    const nextLocale = locale === "th" ? "en" : "th";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-[#0a1128]/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-md shadow-violet-500/5 select-none transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              {/* Outer brand gradient ring around logo */}
              <div className="relative p-[1.5px] bg-brand-gradient rounded-full shadow-md shadow-violet-500/10 group-hover:scale-105 transition-transform duration-300">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white dark:bg-[#131a30] flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="MT Content Planner Logo"
                    fill
                    className="object-cover"
                    sizes="32px"
                    priority
                  />
                </div>
              </div>
              {/* Glossy Brand Gradient Title Text */}
              <span className="font-extrabold text-xl tracking-tight hidden sm:inline-block bg-clip-text text-transparent bg-brand-gradient transition-all">
                MT Content Planner
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          {navItems.length > 0 && (
            <div className="hidden lg:block">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2.5">
            {/* Locale Language Selector Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-3 h-9 bg-white/40 dark:bg-[#1c2541]/40 border border-white/15 dark:border-white/5 rounded-xl text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-500/20 transition-all active:scale-95 font-semibold text-xs shadow-sm cursor-pointer"
              aria-label="Change language"
            >
              <Languages className="h-4 w-4 text-violet-500 dark:text-violet-400" />
              <span className="hidden sm:inline-block">{locale === "th" ? "TH" : "EN"}</span>
            </button>

            {/* Light/Dark Toggle Button */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-center w-9 h-9 bg-white/40 dark:bg-[#1c2541]/40 border border-white/15 dark:border-white/5 rounded-xl text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-500/20 transition-all active:scale-95 shadow-sm cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4.5 w-4.5 text-amber-400" />
                ) : (
                  <Moon className="h-4.5 w-4.5 text-violet-500" />
                )}
              </button>
            )}

            {/* Mobile menu button */}
            {navItems.length > 0 && (
              <div className="lg:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-center w-9 h-9 bg-white/40 dark:bg-[#1c2541]/40 border border-white/15 dark:border-white/5 rounded-xl text-muted-foreground hover:text-foreground transition-all active:scale-95 shadow-sm"
                >
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && navItems.length > 0 && (
        <div className="lg:hidden border-t border-border/40 bg-white/80 dark:bg-[#0a1128]/80 backdrop-blur-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
