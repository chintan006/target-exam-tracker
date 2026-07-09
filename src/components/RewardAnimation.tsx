"use client";

import { useEffect, useState } from "react";

interface RewardAnimationProps {
  show: boolean;
  onComplete: () => void;
  message?: string;
}

const confettiColors = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#06b6d4",
];

export default function RewardAnimation({
  show,
  onComplete,
  message = "Topic Complete! 🎉",
}: RewardAnimationProps) {
  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; color: string; delay: number; size: number }>
  >([]);

  useEffect(() => {
    if (show) {
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: Math.random() * 0.5,
        size: 4 + Math.random() * 6,
      }));
      setConfetti(particles);

      const timeout = setTimeout(() => {
        onComplete();
        setConfetti([]);
      }, 2200);

      return () => clearTimeout(timeout);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {confetti.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.x}%`,
            top: "40%",
            animationDelay: `${p.delay}s`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}

      <div className="relative animate-reward-burst">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-primary-400/50 animate-ring-expand" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-full border-2 border-purple-400/30 animate-ring-expand"
            style={{ animationDelay: "0.2s" }}
          />
        </div>

        <div className="relative bg-gradient-to-br from-primary-500 to-purple-600 w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary-500/40">
          <span className="text-4xl animate-star-pop">⭐</span>
        </div>

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-sm font-bold text-white bg-gradient-to-r from-primary-500/90 to-purple-500/90 px-4 py-1.5 rounded-full shadow-lg">
            {message}
          </span>
        </div>

        {["🔥", "💪", "✨"].map((emoji, i) => (
          <div
            key={i}
            className="absolute animate-float-up text-xl"
            style={{
              left: `${-20 + i * 30}px`,
              top: "-10px",
              animationDelay: `${0.2 + i * 0.15}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
}
