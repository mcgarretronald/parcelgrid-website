import { createElement, type ReactNode } from "react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

type RevealProps = {
  as?: "section" | "div" | "ul" | "ol" | "article";
  /** fade: whole block fades in (sections). stagger: children rise in one after another (card grids). */
  variant?: "fade" | "stagger";
  className?: string;
  children: ReactNode;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

/** Thin wrapper over useRevealOnScroll so pages can opt in without repeating the hook. */
export function Reveal({ as = "div", variant = "fade", className = "", children, ...rest }: RevealProps) {
  const { ref, className: shown } = useRevealOnScroll<HTMLElement>();
  const base = variant === "stagger" ? "reveal-stagger" : "reveal-fade";
  return createElement(as, { ref, className: `${base} ${className} ${shown}`.trim(), ...rest }, children);
}
