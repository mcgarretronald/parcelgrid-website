import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { faqAnswerToText, type FaqAnswer, type FaqItem } from "../lib/faqData";

function Answer({ answer }: { answer: FaqAnswer }) {
  const ListTag = answer.ordered ? "ol" : "ul";
  return (
    <div className="space-y-3 break-words text-sm leading-relaxed text-[#5c6562] sm:text-[15px]">
      <p>{answer.text}</p>
      {answer.list && (
        <ListTag
          className={`space-y-1.5 pl-5 marker:text-[#00473E] ${answer.ordered ? "list-decimal" : "list-disc"}`}
        >
          {answer.list.map((entry) => (
            <li key={entry} className="break-words">
              {entry}
            </li>
          ))}
        </ListTag>
      )}
    </div>
  );
}

export function FaqAccordionItem({
  item,
  defaultOpen = false,
}: {
  item: FaqItem;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();
  const panelId = `${uid}-panel`;

  return (
    <div
      className={`rounded-2xl border bg-white transition-colors ${
        open ? "border-[#00473E]/30" : "border-black/10 hover:border-black/20"
      }`}
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-start justify-between gap-3 rounded-2xl px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00473E]/30 sm:gap-4 sm:px-6 sm:py-5"
        >
          <span className="min-w-0 flex-1 break-words text-[15px] font-semibold text-[#111] sm:text-base">
            {item.question}
          </span>
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-colors ${
              open ? "bg-[#E9FF15] text-[#00473E]" : "bg-[#f4f5f2] text-[#00473E]"
            }`}
            aria-hidden
          >
            <Plus className={`size-4 transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-5 sm:px-6 sm:pb-6">
            <Answer answer={item.answer} />
          </div>
        </div>
      </div>
    </div>
  );
}

export { faqAnswerToText };
