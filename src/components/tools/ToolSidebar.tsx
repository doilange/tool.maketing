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
    <div className="w-full md:w-64 flex-shrink-0 border-r border-white/20 dark:border-white/5 bg-white/45 dark:bg-[#131a30]/45 backdrop-blur-xl z-20">
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-muted">
        {TOOLS_LIST.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTab === tool.id;
          
          return (
            <button
              key={tool.id}
              onClick={() => onTabChange(tool.id)}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                isActive 
                  ? "bg-brand-gradient text-white shadow-md shadow-violet-500/15 scale-[1.01]" 
                  : "text-muted-foreground/80 hover:bg-white/60 dark:hover:bg-[#1c2541]/60 hover:text-foreground hover:translate-x-1"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? "text-white animate-pulse-soft" : "text-violet-500/70 dark:text-violet-400/60"}`} />
              <span className="truncate">{t(tool.id)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
