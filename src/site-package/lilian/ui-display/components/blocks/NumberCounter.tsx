import { useEffect, useRef, useState } from "react";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface NumberCounterItem {
  value: number;
  suffix?: string;
  label: Translation;
}

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface NumberCounterContent {
  stats: NumberCounterItem[];
}

export interface NumberCounterProps {
  content: NumberCounterContent;
  lang: Language;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const duration = 1500;
        const startTime = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          setCurrent(Math.floor(progress * value));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{current}{suffix}</span>;
}

export default function NumberCounter({ content, lang = "en" }: NumberCounterProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const resolvedStats = (content.stats || []).map((item) => ({
    value: item.value,
    suffix: item.suffix,
    label: t(item.label),
  }));

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {resolvedStats.map((item) => (
          <div key={item.label}>
            <p className="text-3xl md:text-4xl mb-2 text-brand">
              <AnimatedNumber value={item.value} suffix={item.suffix} />
            </p>
            <p className="text-xs tracking-wider text-subtle uppercase">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}



