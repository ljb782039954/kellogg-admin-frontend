import { useState } from "react";

export interface FaqAccordionProps {
  title?: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export default function FaqAccordion({ title, items }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      {title && (
        <h3 className="font-luxury-heading text-base md:text-lg lg:text-xl font-medium mb-8 text-center text-body">{title}</h3>
      )}
      <div className="space-y-0">
        {items.map((faq, i) => (
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



