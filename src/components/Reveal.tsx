import { createElement, type ReactNode } from "react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

type RevealProps = {
  as?: "section" | "div" | "ul" | "ol" | "article" | "header" | "nav";
  /** fade | up | scale | left | right | stagger (children rise in sequence). */
  variant?: "fade" | "up" | "scale" | "left" | "right" | "stagger";
  className?: string;
  children: ReactNode;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

const VARIANT_CLASS: Record<NonNullable<RevealProps["variant"]>, string> = {
  fade: "reveal-fade",
  up: "reveal-up",
  scale: "reveal-scale",
  left: "reveal-left",
  right: "reveal-right",
  stagger: "reveal-stagger",
};

/** Thin wrapper over useRevealOnScroll so pages can opt in without repeating the hook. */
export function Reveal({
  as = "div",
  variant = "up",
  className = "",
  children,
  ...rest
}: RevealProps) {
  const { ref, className: shown } = useRevealOnScroll<HTMLElement>();
  const base = VARIANT_CLASS[variant] || "reveal-up";
  // Always include `.reveal` so nested `.reveal-stagger` / `.reveal-up` children animate with the parent.
  return createElement(
    as,
    { ref, className: `reveal ${base} ${className} ${shown}`.trim(), ...rest },
    children,
  );
}
