"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("pwa-install-dismissed") === "1") return;
    } catch {}

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () =>
      window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShow(false);
    try {
      localStorage.setItem("pwa-install-dismissed", "1");
    } catch {}
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-2xl border p-4"
          style={{
            background: "rgba(10, 10, 15, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-2xl" aria-hidden="true">
              📱
            </span>
            <p
              className="flex-1 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              ホーム画面に追加してアプリとして使えます
            </p>
            <button
              onClick={handleInstall}
              className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              インストール
            </button>
            <button
              onClick={handleDismiss}
              className="shrink-0 p-1 text-lg leading-none transition-opacity hover:opacity-60"
              style={{ color: "var(--color-text-secondary)" }}
              aria-label="閉じる"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
