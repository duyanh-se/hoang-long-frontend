import * as React from "react";
import { themeClassNames } from "@/src/lib/design-tokens";
import { cn } from "@/src/lib/utils";

const infoCardVariants = {
  default: themeClassNames.infoCard.default,
  feature: themeClassNames.infoCard.feature,
  elevated: themeClassNames.infoCard.elevated,
  white: themeClassNames.infoCard.white,
  muted: themeClassNames.infoCard.muted,
  success: themeClassNames.infoCard.success,
  warning: themeClassNames.infoCard.warning,
  error: themeClassNames.infoCard.error,
  dark: themeClassNames.infoCard.dark,
} as const;

const infoCardSizes = {
  default: themeClassNames.infoCardSize.default,
  sm: themeClassNames.infoCardSize.sm,
  md: themeClassNames.infoCardSize.md,
  lg: themeClassNames.infoCardSize.lg,
  xl: themeClassNames.infoCardSize.xl,
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
          themeClassNames.infoCard.base,
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
