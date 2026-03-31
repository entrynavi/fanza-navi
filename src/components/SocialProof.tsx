"use client";

import { useState, useEffect } from "react";
import { FaEye, FaShoppingCart, FaUsers } from "react-icons/fa";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function SocialProof() {
  const [viewers, setViewers] = useState(0);
  const [purchases, setPurchases] = useState(0);
  const [showPurchase, setShowPurchase] = useState(false);

  useEffect(() => {
    setViewers(randomBetween(38, 124));
    setPurchases(randomBetween(156, 489));

    // 閲覧数を微変動
    const viewerInterval = setInterval(() => {
      setViewers((v) => v + randomBetween(-2, 3));
    }, 5000);

    // 購入通知をランダム表示
    const purchaseInterval = setInterval(() => {
      setShowPurchase(true);
      setPurchases((p) => p + 1);
      setTimeout(() => setShowPurchase(false), 4000);
    }, randomBetween(15000, 35000));

    return () => {
      clearInterval(viewerInterval);
      clearInterval(purchaseInterval);
    };
  }, []);

  return (
    <>
      {/* Stats bar */}
      <div className="flex flex-wrap justify-center gap-6 py-4 text-sm text-[var(--color-text-secondary)]">
        <span className="flex items-center gap-2">
          <FaEye size={14} className="text-green-400" />
          <span>
            現在 <strong className="text-white">{viewers}</strong> 人が閲覧中
          </span>
        </span>
        <span className="flex items-center gap-2">
          <FaShoppingCart size={14} className="text-yellow-400" />
          <span>
            本日 <strong className="text-white">{purchases}</strong> 件購入
          </span>
        </span>
        <span className="flex items-center gap-2">
          <FaUsers size={14} className="text-blue-400" />
          <span>
            累計 <strong className="text-white">12,847</strong> 人が利用
          </span>
        </span>
      </div>

      {/* Purchase toast */}
      {showPurchase && (
        <div className="fixed bottom-20 left-4 z-40 animate-slide-in">
          <div className="glass-card px-4 py-3 flex items-center gap-3 text-sm max-w-xs shadow-lg border-green-500/20">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
              ✓
            </div>
            <div>
              <p className="text-white font-medium text-xs">
                {randomBetween(1, 5)}分前に購入されました
              </p>
              <p className="text-[var(--color-text-secondary)] text-xs">
                東京都の方が人気作品を購入
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
