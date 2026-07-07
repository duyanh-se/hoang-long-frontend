export const colorTokens = {
  brand: {
    primary: "#d60f0f",
    primaryHover: "#b90f0f",
    primarySoft: "#ffe4e2",
    primaryMuted: "#fee2e2",
    cream: "#fff7f4",
    border: "#fecaca",
  },
  neutral: {
    background: "#fff3f1",
    foreground: "#1d1d1d",
    surface: "#ffffff",
    surfaceMuted: "#fde8e6",
  },
  state: {
    success: "#047857",
    successSoft: "#ecfdf5",
    warning: "#b45309",
    warningSoft: "#fffbeb",
    error: "#b91c1c",
    errorSoft: "#fef2f2",
  },
  dark: {
    background: "#130909",
    foreground: "#f7eceb",
    surface: "#1f1212",
    surfaceMuted: "#3a0f0f",
    primary: "#ff6565",
    primaryHover: "#ff8181",
    primarySoft: "#4a0808",
    border: "#7f1d1d",
  },
} as const;

export const typographyTokens = {
  fontFamily: {
    sans: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
    mono: "var(--font-geist-mono), Consolas, monospace",
  },
  className: {
    eyebrow:
      "text-xs font-bold uppercase tracking-[0.2em] text-(--brand-primary) dark:text-red-300 sm:text-sm sm:tracking-[0.24em]",
    pageTitle:
      "text-3xl font-semibold tracking-tight text-(--foreground) dark:text-white sm:text-5xl",
    sectionTitle:
      "text-2xl font-semibold tracking-tight text-(--foreground) dark:text-white sm:text-4xl",
    body: "text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base sm:leading-8",
    small: "text-xs leading-5 text-zinc-500 dark:text-zinc-400",
  },
} as const;

export const themeClassNames = {
  focusRing:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-red-400",
  button: {
    base: "inline-flex min-w-0 items-center justify-center rounded-full text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
    default:
      "border border-(--brand-border) bg-(--brand-primary-soft) text-red-900 hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-700 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-800/80",
    primary:
      "border border-(--brand-primary) bg-(--brand-primary) text-white shadow-lg shadow-red-950/15 hover:-translate-y-0.5 hover:bg-(--brand-primary-hover) dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-400",
    secondary:
      "border border-(--brand-border) bg-(--brand-primary-soft) text-red-900 hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-700 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-800/80",
    neutral:
      "border border-(--brand-border) bg-(--surface) text-zinc-700 hover:-translate-y-0.5 hover:bg-(--brand-cream) dark:border-red-800 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10",
    outline:
      "border border-(--brand-border) bg-transparent text-red-800 hover:-translate-y-0.5 hover:bg-(--brand-primary-soft) dark:border-red-700 dark:text-red-100 dark:hover:bg-red-950/70",
    inverse: "bg-white text-red-950 hover:bg-red-100",
    ghost:
      "bg-transparent text-current hover:bg-black/5 dark:hover:bg-white/10",
    danger:
      "border border-red-200 bg-(--brand-error-soft) text-red-700 hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/70 dark:text-red-200 dark:hover:bg-red-900/80",
    overlay: "bg-black/40 backdrop-blur-[2px] hover:bg-black/40",
  },
  buttonSize: {
    sm: "h-9 px-4 py-2 text-xs",
    default: "h-11 px-5 py-2",
    lg: "h-12 px-6 py-3",
    icon: "h-11 w-11 p-0",
    iconSm: "h-10 w-10 p-0",
    overlay: "h-auto w-auto p-0",
  },
  infoCard: {
    base: "rounded-3xl border",
    default:
      "border-(--brand-border) bg-(--brand-primary-soft)/90 shadow-sm dark:border-red-700 dark:bg-red-950/60",
    feature:
      "border-(--brand-border) bg-(--brand-primary-soft) text-zinc-800 shadow-sm shadow-red-950/5 dark:border-red-700 dark:bg-red-950/70 dark:text-zinc-100",
    elevated:
      "border-(--brand-border) bg-(--surface)/90 shadow-lg shadow-red-950/5 dark:border-red-700 dark:bg-red-950/75",
    white:
      "border-(--brand-border) bg-(--surface)/95 text-zinc-700 shadow-sm dark:border-red-700 dark:bg-red-950/80 dark:text-zinc-200",
    muted:
      "border-(--brand-border) bg-(--surface)/70 text-zinc-700 shadow-sm dark:border-red-800 dark:bg-white/5 dark:text-zinc-200",
    success:
      "border-emerald-200 bg-(--brand-success-soft) text-emerald-800 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
    warning:
      "border-amber-200 bg-(--brand-warning-soft) text-amber-900 shadow-sm dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100",
    error:
      "border-red-200 bg-(--brand-error-soft) text-red-800 shadow-sm dark:border-red-800 dark:bg-red-950/40 dark:text-red-200",
    dark: "border-red-600/30 bg-white/5 text-white",
  },
  infoCardSize: {
    default: "p-5",
    sm: "px-4 py-3",
    md: "p-5",
    lg: "p-6",
    xl: "p-8",
  },
  field:
    "rounded-2xl border border-(--brand-border) bg-(--surface) px-4 text-sm outline-none transition focus:border-(--brand-primary) dark:border-red-800 dark:bg-red-950 dark:text-white",
  alert: {
    success:
      "rounded-3xl border border-emerald-200 bg-(--brand-success-soft) p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
    error:
      "rounded-3xl border border-red-200 bg-(--brand-error-soft) p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200",
    warning:
      "rounded-3xl border border-amber-200 bg-(--brand-warning-soft) p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
  },
  cart: {
    drawer:
      "absolute right-0 top-0 flex h-dvh w-full max-w-[min(100vw,28rem)] flex-col border-l border-(--brand-border) bg-(--surface) shadow-2xl dark:border-red-900 dark:bg-(--surface)",
    header:
      "flex items-center justify-between border-b border-(--brand-border) bg-(--brand-cream)/80 px-4 py-3 dark:border-red-900 dark:bg-red-950/30 sm:px-5 sm:py-4",
    item: "rounded-3xl border border-(--brand-border) bg-(--surface) p-3 shadow-sm shadow-red-950/5 dark:border-red-800 dark:bg-red-950/70 sm:p-4",
    image:
      "relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-(--brand-border) bg-(--brand-primary-soft) dark:border-red-800 dark:bg-red-950",
    quantity:
      "inline-flex w-fit items-center rounded-full border border-(--brand-border) bg-(--brand-primary-soft) p-1 dark:border-red-800 dark:bg-red-950/70",
    summary:
      "rounded-3xl border border-(--brand-border) bg-(--brand-primary) p-4 text-white shadow-lg shadow-red-950/15 dark:border-red-800 dark:bg-red-950 sm:p-5",
    form: "space-y-3 overflow-hidden rounded-3xl border border-(--brand-border) bg-(--surface) p-4 shadow-sm dark:border-red-800 dark:bg-red-950/70",
  },
} as const;

export type ThemeColorTokens = typeof colorTokens;
export type ThemeTypographyTokens = typeof typographyTokens;
export type ThemeClassNames = typeof themeClassNames;
