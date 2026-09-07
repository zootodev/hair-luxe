"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "outline" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold hover:opacity-90 shadow-lg shadow-gold/20",
  gold:
    "bg-gold text-background font-semibold hover:bg-gold-dark transition-colors",
  outline:
    "border border-gold/40 text-gold hover:bg-gold/10 transition-colors",
  ghost:
    "text-foreground/80 hover:text-gold hover:bg-gold/5 transition-colors",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  fullWidth,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 cursor-pointer ${
    variantClasses[variant]
  } ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}