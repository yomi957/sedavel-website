"use client";

import Link from "next/link";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import styles from "./glass-ui.module.css";

type Strength = "clear" | "regular" | "tinted";
type Variant = "primary" | "secondary" | "neutral";
const classes = (...names: (string | undefined)[]) => names.filter(Boolean).join(" ");
type ButtonProps = ComponentProps<"button"> & { href?: never };
type LinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string; disabled?: never };
export type GlassButtonProps = (ButtonProps | LinkProps) & { variant?: Variant };

/** Keep native link/button semantics; unavailable actions must use a disabled button. */
export function GlassButton({ variant = "primary", className, ...props }: GlassButtonProps) {
  const appearance = classes(styles.control, styles[variant], className);
  if (typeof props.href === "string") {
    const { href, ...linkProps } = props as LinkProps;
    return <Link {...linkProps} href={href} data-glass="button" className={appearance} />;
  }
  return <button type="button" {...props as ButtonProps} data-glass="button" className={appearance} />;
}

export function GlassSurface({ strength = "regular", className, ...props }: HTMLAttributes<HTMLDivElement> & { strength?: Strength }) {
  return <div {...props} data-glass="surface" className={classes(styles.surface, styles[strength], className)} />;
}

/** The existing SiteHeader owns navigation, open/close behavior and active routes. */
export function GlassNavigation({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <header {...props} data-glass="navigation" className={classes(styles.surface, styles.regular, styles.navigation, className)} />;
}

type CardProps = HTMLAttributes<HTMLDivElement> & { href?: never };
type CardLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };
export function GlassCard({ className, ...props }: CardProps | CardLinkProps) {
  const appearance = classes(styles.surface, styles.regular, styles.card, className);
  if (typeof props.href === "string") {
    const { href, ...linkProps } = props as CardLinkProps;
    return <Link {...linkProps} href={href} data-glass="card" className={classes(appearance, styles.interactive)} />;
  }
  return <div {...props as CardProps} data-glass="card" className={appearance} />;
}

export function GlassIconButton({ className, ...props }: ComponentProps<"button"> & { "aria-label": string }) {
  return <button type="button" {...props} data-glass="icon-button" className={classes(styles.control, styles.neutral, styles.iconButton, className)} />;
}

type ToggleOption<T extends string> = { value: T; label: ReactNode };
export function GlassToggle<T extends string>({ options, value, onChange, label }: {
  options: readonly ToggleOption<T>[]; value: T; onChange: (value: T) => void; label: string;
}) {
  return <div data-glass="toggle" className={styles.toggle} role="group" aria-label={label}>
    {options.map(option => <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)} className={styles.toggleOption}>{option.label}</button>)}
  </div>;
}
