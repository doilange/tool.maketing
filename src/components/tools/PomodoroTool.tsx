"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Briefcase, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";

type PomodoroMode = "work" | "shortBreak" | "longBreak";

const MODES = {
  work: { key: "work", duration: 25 * 60, color: "text-rose-500", bg: "bg-rose-500", ring: "ring-rose-500/20" },
  shortBreak: { key: "shortBreak", duration: 5 * 60, color: "text-emerald-500", bg: "bg-emerald-500", ring: "ring-emerald-500/20" },
  longBreak: { key: "longBreak", duration: 15 * 60, color: "text-blue-600", bg: "bg-blue-600", ring: "ring-blue-500/20" }
};

export default function PomodoroTool() {
  const t = useTranslations("PomodoroTool");
  const [mode, setMode] = useState<PomodoroMode>("work");
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create beep sound using Web Audio API
  const playBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      
      // 3 short beeps
      setTimeout(() => { gainNode.gain.value = 0; }, 200);
      setTimeout(() => { gainNode.gain.value = 0.3; }, 400);
      setTimeout(() => { gainNode.gain.value = 0; }, 600);
      setTimeout(() => { gainNode.gain.value = 0.3; }, 800);
      setTimeout(() => {
        oscillator.stop();
        ctx.close();
      }, 1000);
    } catch {
      // Audio not available
    }
  }, [soundEnabled]);

  const switchMode = useCallback((newMode: PomodoroMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(MODES[newMode].duration);
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setTimeout(() => {
        setIsActive(false);
        playBeep();
        
        // Auto-advance logic
        if (mode === "work") {
          const newSessions = sessions + 1;
          setSessions(newSessions);
          
          if (newSessions % 4 === 0) {
            switchMode("longBreak");
          } else {
            switchMode("shortBreak");
          }
        } else {
          switchMode("work");
        }
        
        // Show browser notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(
            mode === "work" ? t("breakNotifTitle") : t("workNotifTitle"),
            { body: mode === "work" ? t("breakNotifBody") : t("workNotifBody") }
          );
        }
      }, 0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, mode, sessions, playBeep, switchMode, t]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Update document title
  useEffect(() => {
    if (isActive) {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      document.title = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")} - ${t(MODES[mode].key)}`;
    } else {
      document.title = "MT Content Planner";
    }
    
    return () => { document.title = "MT Content Planner"; };
  }, [timeLeft, isActive, mode, t]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].duration);
  };

  const skipToNext = () => {
    if (mode === "work") {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      switchMode(newSessions % 4 === 0 ? "longBreak" : "shortBreak");
    } else {
      switchMode("work");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progress = ((MODES[mode].duration - timeLeft) / MODES[mode].duration) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <div className="container mx-auto px-4 py-8 select-none flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="relative max-w-md w-full">
        <div className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm rounded-lg p-8 overflow-hidden flex flex-col items-center">

          {/* Mode Tabs */}
          <div className="flex space-x-1 mb-8 bg-slate-100 dark:bg-white/5 p-1.5 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
            {(Object.keys(MODES) as PomodoroMode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`px-4.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === m
                    ? `bg-brand-gradient text-white shadow-md shadow-blue-900/10`
                    : "text-slate-600 hover:text-slate-950 hover:bg-white dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-white/10"
                }`}
              >
                {t(MODES[m].key)}
              </button>
            ))}
          </div>

          {/* Timer Circle */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="45"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-muted-foreground/10 dark:text-white/5"
              />
              <circle
                cx="50" cy="50" r="45"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-linear ${MODES[mode].color}`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-extrabold font-mono tracking-tight text-foreground text-slate-950 dark:text-slate-50">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] font-extrabold text-muted-foreground/60 uppercase tracking-widest mt-2">
                {t(MODES[mode].key)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={toggleTimer}
              className={`flex items-center justify-center w-16 h-16 rounded-full text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer bg-brand-gradient shadow-blue-900/10`}
            >
              {isActive ? <Pause className="w-6 h-6 fill-current text-white" /> : <Play className="w-6 h-6 fill-current text-white ml-1" />}
            </button>

            <button
              onClick={resetTimer}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-white hover:bg-slate-50 dark:bg-white/5 dark:hover:bg-white/10 text-foreground border border-slate-200 dark:border-white/10 transition-all active:scale-95 shadow-sm cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-4.5 h-4.5 text-blue-600" />
            </button>

            <button
              onClick={skipToNext}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-white hover:bg-slate-50 dark:bg-white/5 dark:hover:bg-white/10 text-foreground border border-slate-200 dark:border-white/10 transition-all active:scale-95 shadow-sm cursor-pointer"
              title="Skip to next"
            >
              <SkipForward className="w-4.5 h-4.5 text-blue-600" />
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-white hover:bg-slate-50 dark:bg-white/5 dark:hover:bg-white/10 text-foreground border border-slate-200 dark:border-white/10 transition-all active:scale-95 shadow-sm cursor-pointer"
              title={soundEnabled ? "Mute" : "Unmute"}
            >
              {soundEnabled ? <Volume2 className="w-4.5 h-4.5 text-blue-600" /> : <VolumeX className="w-4.5 h-4.5 text-rose-500" />}
            </button>
          </div>

          {/* Session Counter panel */}
          <div className="flex items-center space-x-4 text-xs font-semibold text-muted-foreground/80 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-5 py-3 rounded-lg shadow-sm w-full">
            <div className="flex items-center space-x-1.5 justify-center flex-1">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>{t("sessions")}: <strong className="text-foreground">{sessions}</strong></span>
            </div>
            <span className="text-white/20 dark:text-white/5">|</span>
            <div className="flex items-center space-x-1.5 justify-center flex-1">
              <Coffee className="w-4 h-4 text-blue-600" />
              <span>{t("nextLongBreak")}: <strong className="text-foreground">{4 - (sessions % 4)}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
