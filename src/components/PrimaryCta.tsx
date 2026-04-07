import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { FaArrowRight } from "react-icons/fa";

type PrimaryCtaVariant = "solid" | "outline" | "ghost";
type PrimaryCtaSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<PrimaryCtaVariant, string> = {
  solid:
    "bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-[0_18px_40px_rgba(158,68,90,0.28)] hover:-translate-y-0.5 hover:shadow-[0_22px_45px_rgba(158,68,90,0.32)]",
  outline:
    "border border-white/12 bg-white/4 text-[var(--color-text-primary)] hover:border-[var(--color-primary)]/35 hover:bg-white/8",
  ghost:
    "border border-transparent bg-transparent text-[var(--color-text-secondary)] hover:text-white",
};

const SIZE_CLASSES: Record<PrimaryCtaSize, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-3.5 text-sm md:text-base",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function PrimaryCta({
  href,
  children,
  variant = "solid",
  size = "md",
  className,
  external = false,
  showArrow = true,
  fullWidth = false,
  ...props
}: {
  href: string;
  children: ReactNode;
  variant?: PrimaryCtaVariant;
  size?: PrimaryCtaSize;
  className?: string;
  external?: boolean;
  showArrow?: boolean;
  fullWidth?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "className">) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[0.01em] transition-all duration-200",
        fullWidth && "w-full",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className
      )}
    >
      <span>{children}</span>
      {showArrow ? <FaArrowRight size={12} /> : null}
    </a>
  );
}
