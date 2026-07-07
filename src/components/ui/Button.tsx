import * as React from "react";
import { themeClassNames } from "@/src/lib/design-tokens";
import { cn } from "@/src/lib/utils";

const buttonVariants = {
  default: themeClassNames.button.default,
  primary: themeClassNames.button.primary,
  secondary: themeClassNames.button.secondary,
  neutral: themeClassNames.button.neutral,
  outline: themeClassNames.button.outline,
  inverse: themeClassNames.button.inverse,
  ghost: themeClassNames.button.ghost,
  danger: themeClassNames.button.danger,
  overlay: themeClassNames.button.overlay,
} as const;

const buttonSizes = {
  sm: themeClassNames.buttonSize.sm,
  default: themeClassNames.buttonSize.default,
  lg: themeClassNames.buttonSize.lg,
  icon: themeClassNames.buttonSize.icon,
  iconSm: themeClassNames.buttonSize.iconSm,
  overlay: themeClassNames.buttonSize.overlay,
} as const;

type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      type = "button",
      suppressHydrationWarning = true,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        suppressHydrationWarning={suppressHydrationWarning}
        className={cn(
          themeClassNames.button.base,
          themeClassNames.focusRing,
          buttonVariants[variant],
          buttonSizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      suppressHydrationWarning = true,
      ...props
    },
    ref,
  ) => {
    return (
      <a
        ref={ref}
        suppressHydrationWarning={suppressHydrationWarning}
        className={cn(
          themeClassNames.button.base,
          themeClassNames.focusRing,
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          buttonVariants[variant],
          buttonSizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

ButtonLink.displayName = "ButtonLink";

export { Button, ButtonLink, buttonVariants };
