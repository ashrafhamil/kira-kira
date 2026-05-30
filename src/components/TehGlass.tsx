/** Teh-tarik glass that fills with collection progress. Pure SVG. */
export function TehGlass({
  percent,
  className = "",
}: {
  percent: number;
  className?: string;
}) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  const done = p >= 100;
  // Glass interior runs from y=16 (rim) to y=122 (base): 106px of travel.
  const topY = 122 - (106 * p) / 100;
  const glass = "M22 16 H88 L82 122 Q81 126 76 126 H34 Q29 126 28 122 Z";

  return (
    <svg
      viewBox="0 0 110 134"
      className={className}
      role="img"
      aria-label={`${p}% collected`}
    >
      <defs>
        <linearGradient id="tehFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--teh-300)" />
          <stop offset="100%" stopColor="var(--teh-500)" />
        </linearGradient>
        <linearGradient id="tehDone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3FA76A" />
          <stop offset="100%" stopColor="var(--paid)" />
        </linearGradient>
        <clipPath id="glassClip">
          <path d={glass} />
        </clipPath>
      </defs>

      <path
        d={glass}
        fill="var(--surface-sunken)"
        stroke="var(--border-strong)"
        strokeWidth="2"
      />

      <g clipPath="url(#glassClip)" style={{ animation: "teh-rise 0.6s ease-out" }}>
        <rect
          x="18"
          y={topY}
          width="74"
          height="140"
          fill={done ? "url(#tehDone)" : "url(#tehFill)"}
        />
        {p > 0 && (
          <ellipse cx="55" cy={topY} rx="33" ry="3.5" fill="#FBF4E6" opacity="0.85" />
        )}
      </g>

      <path d="M22 16 H88" stroke="var(--border-strong)" strokeWidth="3" strokeLinecap="round" />

      <text
        x="55"
        y="80"
        textAnchor="middle"
        fontSize="25"
        fontWeight="700"
        className="font-mono-amount"
        fill={p > 42 ? "#FFF9EE" : "var(--foreground)"}
      >
        {p}%
      </text>
    </svg>
  );
}
