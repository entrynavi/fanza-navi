"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowRight, FaDoorOpen, FaShieldAlt } from "react-icons/fa";

const STORAGE_KEY = "fanza-age-gate-accepted";
const EXIT_URL = "https://www.google.com/";

export default function AgeGate() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof document === "undefined") {
      return true;
    }

    return document.documentElement.dataset.ageGateAccepted !== "1";
  });
  const previousOverflow = useRef("");
  const acceptButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = previousOverflow.current;
      const appShell = document.getElementById("app-shell");
      appShell?.removeAttribute("inert");
      appShell?.removeAttribute("aria-hidden");
      return;
    }

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const appShell = document.getElementById("app-shell");
    appShell?.setAttribute("inert", "");
    appShell?.setAttribute("aria-hidden", "true");

    acceptButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow.current;
      appShell?.removeAttribute("inert");
      appShell?.removeAttribute("aria-hidden");
    };
  }, [isOpen]);

  const handleAccept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore storage failures and continue letting the user in.
    }

    document.documentElement.dataset.ageGateAccepted = "1";
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-age-gate
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md"
        >
          <motion.section
            initial={false}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 24 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="age-gate-title"
            className="glass-card relative w-full max-w-xl overflow-hidden border border-[var(--color-border)] bg-[rgba(26,26,46,0.95)] p-6 shadow-2xl shadow-black/40 md:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-gold)]" />

            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg shadow-[rgba(228,0,127,0.25)]">
                <FaShieldAlt size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary-light)]">
                  18+ Verification
                </p>
                <h2 id="age-gate-title" className="text-2xl font-extrabold md:text-3xl">
                  18歳以上ですか？
                </h2>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  当サイトは18歳以上の方を対象としたコンテンツを含みます。年齢をご確認のうえご利用ください。
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                18歳以上の方は確認ボタンから先へ進めます。続行すると、以後この端末では確認画面を省略します。
              </p>
              <p>
                18歳未満の方は下のリンクからサイトを離れてください。
              </p>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <a
                href={EXIT_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-white/10"
              >
                <FaDoorOpen size={14} />
                18歳未満の方はこちら
                <FaArrowRight size={12} />
              </a>

              <button
                ref={acceptButtonRef}
                type="button"
                onClick={handleAccept}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-5 py-3 text-sm font-bold text-white transition-all hover:from-[var(--color-primary-light)] hover:to-[var(--color-primary)]"
              >
                18歳以上です
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
