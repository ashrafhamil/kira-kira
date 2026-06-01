"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Tasteful entrance reveal. `mount` animates on load (above the fold);
 *  otherwise it animates when scrolled into view, once. Respects
 *  prefers-reduced-motion (renders static). */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  mount = false,
  lift = false,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  mount?: boolean;
  lift?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const shown = { opacity: 1, y: 0 };
  const animateProps = mount
    ? { animate: shown }
    : { whileInView: shown, viewport: { once: true, margin: "-60px" } };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...animateProps}
      {...(lift ? { whileHover: { y: -4 } } : {})}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
