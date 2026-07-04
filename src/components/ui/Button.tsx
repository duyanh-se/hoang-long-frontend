import * as React from "react";
import { cn } from "@/src/lib/utils";

const buttonVariants = {
  default:
    "border border-red-200 bg-red-50 text-red-900 hover:-translate-y-0.5 hover:bg-red-100 dark:border-red-700 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-800/80",
  neutral:
    "border border-black/10 bg-white text-zinc-700 hover:-translate-y-0.5 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10",
  inverse: "bg-white text-red-950 hover:bg-red-100",
  ghost: "bg-transparent text-current hover:bg-black/5 dark:hover:bg-white/10",
  overlay: "bg-black/40 backdrop-blur-[2px] hover:bg-black/40",
} as const;

const buttonSizes = {
  default: "h-11 px-5 py-2",
  lg: "h-12 px-6 py-3",
  icon: "h-11 w-11 p-0",
  iconSm: "h-10 w-10 p-0",
  overlay: "h-auto w-auto p-0",
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
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-red-400",
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
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:focus-visible:ring-red-400",
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
