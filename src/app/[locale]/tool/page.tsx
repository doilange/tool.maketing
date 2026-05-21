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
        return <div className="p-6 max-w-4xl mx-auto"><Authenticator /></div>;
      case "edit_text":
        return <div className="p-6"><TextManipulationTool /></div>;
      case "cookie":
        return <div className="p-6"><CookieTool /></div>;
      case "pomodoro":
        return <div className="p-6"><PomodoroTool /></div>;
      case "uid_year":
        return <div className="p-6"><UidToYearTool /></div>;
      case "duplicate":
        return <div className="p-6"><DuplicateFilterTool /></div>;
      case "reverse_word":
        return <div className="p-6"><ReverseTextTool /></div>;
      case "split_string":
        return <div className="p-6"><StringSplitTool /></div>;
      case "filter_string":
        return <div className="p-6"><FilterTool /></div>;
      case "merge_lines":
        return <div className="p-6"><MergeTool /></div>;
      case "html_extractor":
        return <div className="p-6"><HtmlExtractorTool /></div>;
      case "json":
        return <div className="p-6"><JsonTool /></div>;
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
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] planner-theme overflow-hidden relative select-none">
      {/* Slow-floating background glow backlights */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-violet-400/10 dark:bg-violet-500/5 blur-[80px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-pink-400/10 dark:bg-pink-500/5 blur-[90px] pointer-events-none animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-blue-300/10 dark:bg-blue-600/5 blur-[100px] pointer-events-none animate-pulse-soft" />

      {/* Glassmorphic Sidebar */}
      <ToolSidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Tool Viewer content container */}
      <div className="flex-1 w-full bg-white/5 dark:bg-[#0a1128]/5 backdrop-blur-[2px] overflow-y-auto z-10">
        {renderTool()}
      </div>
    </div>
  );
}

export default function ToolPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen planner-theme">Loading...</div>}>
      <ToolPageContent />
    </Suspense>
  );
}
