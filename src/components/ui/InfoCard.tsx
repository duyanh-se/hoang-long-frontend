import * as React from "react";
import { cn } from "@/src/lib/utils";

const infoCardVariants = {
  default:
    "border-red-100 bg-red-50/90 shadow-sm dark:border-red-700 dark:bg-red-950/60",
  feature:
    "border-red-100 bg-red-50 text-zinc-800 shadow-sm shadow-red-950/5 dark:border-red-700 dark:bg-red-950/70 dark:text-zinc-100",
  elevated:
    "border-red-100 bg-white/90 shadow-lg shadow-red-950/5 dark:border-red-700 dark:bg-red-950/75",
  white:
    "border-red-100 bg-white/95 text-zinc-700 shadow-sm dark:border-red-700 dark:bg-red-950/80 dark:text-zinc-200",
  dark: "border-red-600/30 bg-white/5 text-white",
} as const;

const infoCardSizes = {
  default: "p-5",
  sm: "px-4 py-3",
  md: "p-5",
  lg: "p-6",
  xl: "p-8",
} as const;

type InfoCardVariant = keyof typeof infoCardVariants;
type InfoCardSize = keyof typeof infoCardSizes;

export type InfoCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: InfoCardVariant;
  size?: InfoCardSize;
};

const InfoCard = React.forwardRef<HTMLDivElement, InfoCardProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl border",
          infoCardVariants[variant],
          infoCardSizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

InfoCard.displayName = "InfoCard";

export { InfoCard, infoCardVariants };
