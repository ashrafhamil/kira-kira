"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { formatMoney } from "@/lib/format";

/** Count-up money display. Tweens from the previous value to the next whenever
 *  `value` changes, so a re-split visibly "rolls" into place. */
export function AnimatedMoney({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return <span className={className}>{formatMoney(display)}</span>;
}
