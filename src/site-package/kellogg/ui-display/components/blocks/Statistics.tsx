import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from "react";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface StatisticContent {
  id: number;
  value: string;
  label: Translation;
}

export interface StatisticsContent {
  title?: Translation;
  subtitle?: Translation;
  items?: StatisticContent[];
}
export interface StatisticsProps {
  content: StatisticsContent;
  lang: Language;
}

export default function Statistics({ content: {title, subtitle, items = []}, lang }: StatisticsProps) {
  const translate = createTranslate(lang);
  const titleText = title ? translate(title) : "";
  const subtitleText = subtitle ? translate(subtitle) : "";

  const viewItems = (items ?? []).map((item) => ({
    id: item.id,
    value: item.value,
    labelText: translate(item.label),
  }));

  if (viewItems.length === 0) return null;

  return (
    <section className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          {titleText && <h2 className="text-2xl md:text-4xl font-bold mb-4">{titleText}</h2>}
          {subtitleText && <p className="text-gray-400 text-md md:text-lg">{subtitleText}</p>}
        </div>
        
        <div className="flex flex-row justify-between max-w-6xl mx-auto gap-2 md:gap-4">
          {viewItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-white">
                <AnimatedNumber value={item.value} />
              </div>
              <div className="text-sm md:text-base text-gray-400">
                {item.labelText}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/\D/g, ''));
      const suffix = value.replace(/[0-9]/g, '');
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current) + suffix);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{displayValue}</span>;
}
