"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - new Date().getTime();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
}

export default function CountdownTimer({ targetDate, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    if (compact) {
      return (
        <div className="flex items-center gap-[6px]">
          {["--", "--", "--", "--"].map((v, i) => (
            <div key={i} className="w-[44px] h-[36px] rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
              <span className="text-xs font-bold text-white/20 tabular-nums">{v}</span>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="flex gap-2.5">
        {["--", "--", "--", "--"].map((v, i) => (
          <div key={i} className="text-center">
            <div className="countdown-digit rounded-xl px-3 py-2.5 min-w-[64px]">
              <div className="text-2xl font-bold text-white/20">{v}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (timeLeft.total <= 0) {
    return (
      <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15">
        <span className="text-emerald-400 font-semibold text-xs">✅ Exam Day / Passed</span>
      </div>
    );
  }

  const items = [
    { value: timeLeft.days, label: "D" },
    { value: timeLeft.hours, label: "H" },
    { value: timeLeft.minutes, label: "M" },
    { value: timeLeft.seconds, label: "S" },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-[6px]">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-[44px] h-[36px] rounded-lg bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.06] flex items-center justify-center">
              <span className="text-[15px] font-extrabold text-white tabular-nums leading-none">
                {String(item.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[8px] font-semibold text-slate-600 mt-[3px] uppercase tracking-widest">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const fullItems = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className="flex gap-3">
      {fullItems.map((item, i) => (
        <div key={i} className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-primary-500/10 blur-md" />
            <div className="relative w-[68px] h-[56px] rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] flex items-center justify-center">
              <span className="text-[26px] font-black text-white tabular-nums leading-none animate-count-pulse">
                {String(item.value).padStart(2, "0")}
              </span>
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-500 mt-1.5 block uppercase tracking-[0.15em]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
