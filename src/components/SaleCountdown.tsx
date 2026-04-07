"use client";

import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/** セール終了までのカウントダウン。endDate が過去ならnull。 */
export default function SaleCountdown({
  endDate,
  compact = false,
}: {
  endDate: string | Date;
  compact?: boolean;
}) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(endDate).getTime();
    const tick = () => setRemaining(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (remaining === null || remaining <= 0) return null;

  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-bold text-white tabular-nums">
        <FaClock size={9} />
        {hours > 0 && `${hours}:`}
        {pad(minutes)}:{pad(seconds)}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-3 py-2 text-sm">
      <FaClock size={12} className="text-red-400" />
      <span className="text-red-300 font-medium">セール終了まで</span>
      <span className="font-mono font-bold tabular-nums text-red-200">
        {hours > 0 && <>{hours}<span className="text-red-400/60">時間</span> </>}
        {pad(minutes)}<span className="text-red-400/60">分</span>{" "}
        {pad(seconds)}<span className="text-red-400/60">秒</span>
      </span>
    </div>
  );
}
