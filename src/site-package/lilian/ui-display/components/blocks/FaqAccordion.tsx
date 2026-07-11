import { useState } from "react";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface FaqAccordionItem {
  question: Translation;
  answer: Translation;
}

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface FaqAccordionContent {
  title?: Translation;
  items: FaqAccordionItem[];
}

export interface FaqAccordionProps {
  content: FaqAccordionContent;
  lang: Language;
}

export default function FaqAccordion({ content, lang = "en" }: FaqAccordionProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const resolvedTitle = t(content.title);
  const resolvedItems = (content.items || []).map((item) => ({
    question: t(item.question),
    answer: t(item.answer),
  }));
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      {resolvedTitle && (
        <h3 className="font-luxury-heading text-base md:text-lg lg:text-xl font-medium mb-8 text-center text-body">{resolvedTitle}</h3>
      )}
      <div className="space-y-0">
        {resolvedItems.map((faq, i) => (
          <div key={i} className="border-b border-border">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-xs md:text-sm lg:text-base pr-4 text-body">{faq.question}</span>
              <span className="text-subtle text-sm flex-shrink-0">
                {open === i ? "-" : "+"}
              </span>
            </button>
            {open === i && (
              <p className="pb-4 text-xs md:text-sm lg:text-base text-subtle ">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}



