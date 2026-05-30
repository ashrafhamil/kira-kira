"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

/** Fires a kopitiam-pigment confetti burst once when `fire` becomes true. */
export function Confetti({ fire }: { fire: boolean }) {
  useEffect(() => {
    if (!fire) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const colors = ["#C8442B", "#C77F1A", "#1E6B3A", "#FBF4E6"];
    const end = Date.now() + 900;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [fire]);

  return null;
}
