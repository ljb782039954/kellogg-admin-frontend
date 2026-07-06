import { useEffect, useRef, useState } from "react";

export interface NumberCounterItemProps {
  value: number;
  suffix?: string;
  label: string;
}

export interface NumberCounterProps {
  stats: NumberCounterItemProps[];
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

export default function NumberCounter({ stats }: NumberCounterProps) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((item) => (
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



