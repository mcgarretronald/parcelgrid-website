import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FaqAccordionItem } from "./FaqAccordion";
import type { FaqItem } from "../lib/faqData";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

type MiniFaqProps = {
  id: string;
  items: FaqItem[];
  kicker?: string;
  heading?: string;
  description: string;
  tone?: "light" | "white";
};

/** Short, topic-specific accordion placed right above the footer of key landing pages. */
export function MiniFaq({
  id,
  items,
  kicker = "Quick answers",
  heading = "Frequently Asked Questions",
  description,
  tone = "light",
}: MiniFaqProps) {
  const { ref, className } = useRevealOnScroll();

  return (
    <section
      ref={ref}
      aria-labelledby={`${id}-heading`}
      className={`reveal border-t border-black/[0.06] py-14 sm:py-20 ${
        tone === "light" ? "bg-[#f7f8f6]" : "bg-white"
      } ${className}`}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <div className="reveal-up">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">{kicker}</p>
          <h2
            id={`${id}-heading`}
            className="mt-3 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-[#111] sm:text-4xl"
          >
            {heading}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#5c6562]">{description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/faq"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00473E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#005d4f]"
            >
              View all FAQs <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center rounded-full border border-[#00473E]/25 bg-white px-5 text-sm font-semibold text-[#00473E] hover:bg-[#00473E]/5"
            >
              Contact support
            </Link>
          </div>
        </div>

        <div className="reveal-stagger space-y-3">
          {items.map((item, i) => (
            <FaqAccordionItem key={item.id} item={item} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
