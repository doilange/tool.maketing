"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import ToolSidebar from "@/components/tools/ToolSidebar";
import TextManipulationTool from "@/components/tools/TextManipulationTool";
import Authenticator from "@/components/tools/Authenticator";
import CookieTool from "@/components/tools/CookieTool";
import PomodoroTool from "@/components/tools/PomodoroTool";
import UidToYearTool from "@/components/tools/UidToYearTool";
import DuplicateFilterTool from "@/components/tools/DuplicateFilterTool";
import ReverseTextTool from "@/components/tools/ReverseTextTool";
import StringSplitTool from "@/components/tools/StringSplitTool";
import FilterTool from "@/components/tools/FilterTool";
import MergeTool from "@/components/tools/MergeTool";
import HtmlExtractorTool from "@/components/tools/HtmlExtractorTool";
import JsonTool from "@/components/tools/JsonTool";

function ToolPageContent() {
  const t = useTranslations("Sidebar");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Default to authenticator if no tab is selected
  const activeTab = searchParams.get("tab") || "authenticator";

  const handleTabChange = (tab: string) => {
    router.push(`${pathname}?tab=${tab}`);
  };

  const renderTool = () => {
    switch (activeTab) {
      case "authenticator":
        return <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8"><Authenticator /></div>;
      case "edit_text":
        return <div className="p-4 sm:p-6 lg:p-8"><TextManipulationTool /></div>;
      case "cookie":
        return <div className="p-4 sm:p-6 lg:p-8"><CookieTool /></div>;
      case "pomodoro":
        return <div className="p-4 sm:p-6 lg:p-8"><PomodoroTool /></div>;
      case "uid_year":
        return <div className="p-4 sm:p-6 lg:p-8"><UidToYearTool /></div>;
      case "duplicate":
        return <div className="p-4 sm:p-6 lg:p-8"><DuplicateFilterTool /></div>;
      case "reverse_word":
        return <div className="p-4 sm:p-6 lg:p-8"><ReverseTextTool /></div>;
      case "split_string":
        return <div className="p-4 sm:p-6 lg:p-8"><StringSplitTool /></div>;
      case "filter_string":
        return <div className="p-4 sm:p-6 lg:p-8"><FilterTool /></div>;
      case "merge_lines":
        return <div className="p-4 sm:p-6 lg:p-8"><MergeTool /></div>;
      case "html_extractor":
        return <div className="p-4 sm:p-6 lg:p-8"><HtmlExtractorTool /></div>;
      case "json":
        return <div className="p-4 sm:p-6 lg:p-8"><JsonTool /></div>;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-12 text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">{t(activeTab) || activeTab}</h2>
            <p>This tool is currently being developed.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden bg-slate-50 text-slate-950 dark:bg-[#0b1020] dark:text-slate-50 md:flex-row">
      <ToolSidebar activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="w-full flex-1 overflow-y-auto">
        {renderTool()}
      </div>
    </div>
  );
}

export default function ToolPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#0b1020]">Loading...</div>}>
      <ToolPageContent />
    </Suspense>
  );
}
