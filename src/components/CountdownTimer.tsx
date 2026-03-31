"use client";

import { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";

interface Props {
  endDate?: Date;
  label?: string;
}

export default function CountdownTimer({
  endDate,
  label = "セール終了まで",
}: Props) {
  const target = endDate || getNextMondayMidnight();
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft(target));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(target));
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <FaClock className="text-[var(--color-primary)] animate-pulse" />
      <span className="text-sm text-[var(--color-text-secondary)]">
        {label}
      </span>
      <div className="flex gap-1.5">
        <TimeUnit value={timeLeft.days} unit="日" />
        <span className="text-[var(--color-primary)] font-bold self-center">:</span>
        <TimeUnit value={timeLeft.hours} unit="時間" />
        <span className="text-[var(--color-primary)] font-bold self-center">:</span>
        <TimeUnit value={timeLeft.minutes} unit="分" />
        <span className="text-[var(--color-primary)] font-bold self-center">:</span>
        <TimeUnit value={timeLeft.seconds} unit="秒" />
      </div>
    </div>
  );
}

function TimeUnit({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg px-2.5 py-1 font-mono text-lg font-bold text-white min-w-[2.5rem] text-center">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
        {unit}
      </span>
    </div>
  );
}

function getNextMondayMidnight(): Date {
  const now = new Date();
  const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilMonday);
  next.setHours(0, 0, 0, 0);
  return next;
}

function calcTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
