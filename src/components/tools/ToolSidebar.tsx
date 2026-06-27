"use client";

import { useTranslations } from "next-intl";
import { 
  Shield, Cookie, Timer, Edit3, Calendar, Scissors,
  Copy, RefreshCcw, Filter, 
  Code2, FileJson, Layers
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TOOLS_LIST = [
  { id: "authenticator", icon: Shield },
  { id: "cookie", icon: Cookie },
  { id: "pomodoro", icon: Timer },
  { id: "edit_text", icon: Edit3 },
  { id: "uid_year", icon: Calendar },
  { id: "split_string", icon: Scissors },
  { id: "merge_lines", icon: Layers },
  { id: "duplicate", icon: Copy },
  { id: "reverse_word", icon: RefreshCcw },
  { id: "filter_string", icon: Filter },
  { id: "html_extractor", icon: Code2 },
  { id: "json", icon: FileJson },
];

export default function ToolSidebar({ activeTab, onTabChange }: SidebarProps) {
  const t = useTranslations("Sidebar");
  
  return (
    <aside className="w-full flex-shrink-0 border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#111827] md:w-64 md:border-b-0 md:border-r">
      <div className="flex gap-1 overflow-x-auto p-3 md:h-[calc(100vh-4rem)] md:flex-col md:gap-1 md:overflow-y-auto md:p-4">
        {TOOLS_LIST.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTab === tool.id;
          
          return (
            <button
              key={tool.id}
              onClick={() => onTabChange(tool.id)}
              className={`flex min-h-10 shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors cursor-pointer md:w-full ${
                isActive 
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-50"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
              <span className="truncate">{t(tool.id)}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
