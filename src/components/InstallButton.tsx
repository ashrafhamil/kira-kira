"use client";

import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Shows an Install affordance only when the PWA is actually installable.
 *  Android/desktop Chrome: native install prompt. iOS Safari: a how-to hint
 *  (iOS has no programmatic install). Hidden once installed. */
export function InstallButton({ className = "" }: { className?: string }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean };
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      nav.standalone === true
    ) {
      setInstalled(true);
      return;
    }
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  if (deferred) {
    return (
      <button
        type="button"
        onClick={async () => {
          await deferred.prompt();
          setDeferred(null);
        }}
        className={className}
      >
        <Download className="size-4" aria-hidden /> Install
      </button>
    );
  }

  if (isIOS) {
    return (
      <div className="relative">
        <button type="button" onClick={() => setHint((v) => !v)} className={className}>
          <Download className="size-4" aria-hidden /> Install
        </button>
        {hint && (
          <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-[var(--radius-md)] border border-border bg-surface p-3 text-left text-xs text-foreground-body shadow-[var(--shadow-lg)]">
            In Safari, tap <Share className="inline size-3.5" aria-hidden /> Share, then{" "}
            <span className="font-semibold text-foreground">Add to Home Screen</span>.
          </div>
        )}
      </div>
    );
  }
  return null;
}
