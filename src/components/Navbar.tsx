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
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 select-none shadow-sm transition-colors dark:border-white/10 dark:bg-[#0b1020]/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative rounded-lg border border-slate-200 bg-white p-1 shadow-sm transition-colors group-hover:border-blue-200 dark:border-white/10 dark:bg-[#111827] dark:group-hover:border-blue-400/30">
                <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-white dark:bg-[#111827]">
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
              <span className="hidden whitespace-nowrap text-lg font-extrabold tracking-tight text-slate-950 transition-colors dark:text-slate-50 sm:inline-block">
                MT Content Planner
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          {navItems.length > 0 && (
            <div className="hidden 2xl:block">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-50"
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
              className="flex h-9 cursor-pointer items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-700 active:scale-[0.99] dark:border-white/10 dark:bg-[#111827] dark:text-slate-300 dark:hover:border-blue-400/30 dark:hover:text-blue-300"
              aria-label="Change language"
            >
              <Languages className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              <span className="hidden sm:inline-block">{locale === "th" ? "TH" : "EN"}</span>
            </button>

            {/* Light/Dark Toggle Button */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-700 active:scale-[0.99] dark:border-white/10 dark:bg-[#111827] dark:text-slate-300 dark:hover:border-blue-400/30 dark:hover:text-blue-300"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4.5 w-4.5 text-amber-400" />
                ) : (
                  <Moon className="h-4.5 w-4.5 text-blue-600 dark:text-blue-300" />
                )}
              </button>
            )}

            {/* Mobile menu button */}
            {navItems.length > 0 && (
              <div className="flex items-center 2xl:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:text-slate-950 active:scale-[0.99] dark:border-white/10 dark:bg-[#111827] dark:text-slate-300 dark:hover:text-slate-50"
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
        <div className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-[#0b1020] 2xl:hidden">
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
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-50"
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
