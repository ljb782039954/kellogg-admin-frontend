import MotionHeaderDark from "../custom/motionHeaderDark";
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import type { Translation } from "@/types";

export interface Statistic {
  id: number;
  value: string;
  label: Translation;
}

export interface StatisticProps {
  title?: Translation;
  subtitle?: Translation;
  items?: Statistic[];
}

interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: StatisticProps;
}

export default function Statistics({ t, props }: Props) {
  const { title, subtitle, items } = props;

  // 如果没有数据，直接返回null
  if (items.length === 0) return null;

  return (
    <section className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <MotionHeaderDark t={t} title={title} subtitle={subtitle} />
        {/* Stats Grid */}
        <div className="flex flex-row justify-between max-w-6xl mx-auto gap-2 md:gap-4">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-white`}>
                <AnimatedNumber value={item.value} />
              </div>
              <div className={`text-sm md:text-base text-gray-400`}>
                {t(item.label)}
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
  const isInView = useInView(ref, { once: true });

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
