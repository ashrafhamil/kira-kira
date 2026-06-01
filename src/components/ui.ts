const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export const btn = {
  primary: `${base} bg-primary text-primary-foreground px-5 py-3 shadow-[var(--shadow-sm)] hover:brightness-110`,
  accent: `${base} bg-accent text-accent-foreground px-5 py-3 shadow-[var(--kira-shadow-glow-accent)] hover:brightness-105`,
  secondary: `${base} bg-secondary text-secondary-foreground px-5 py-3 hover:brightness-110`,
  whatsapp: `${base} bg-whatsapp text-whatsapp-foreground px-4 py-2.5 hover:brightness-105`,
  ghost: `${base} border border-border bg-surface text-foreground px-5 py-3 hover:bg-surface-sunken`,
};

export const card =
  "rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-sm)]";

export const input =
  "w-full rounded-[var(--radius-sm)] border border-border bg-surface-sunken px-3.5 py-2.5 text-foreground placeholder:text-foreground-muted focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30";
