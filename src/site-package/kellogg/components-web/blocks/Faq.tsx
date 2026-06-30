import { useState } from 'react';
import { ChevronDown, } from 'lucide-react';

import { Button } from '@/components/ui/button';
import MotionHeader from '../custom/motionHeader';
import { AnimatePresence, motion } from 'framer-motion';
import type { Translation } from '@/types';

export interface FAQItem {
  id: number;
  question: Translation;
  answer: Translation;
}

export interface FAQProps {
  title?: Translation;
  subtitle?: Translation;
  items?: FAQItem[];
}

interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: FAQProps;
}

export default function Faq({ t, props }: Props) {
  const { title, subtitle, items } = props;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);


  const hasMore = items.length > 5;
  const displayedItems = isExpanded ? items : items.slice(0, 5);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // 如果没有数据，直接返回null
  if (!items || items.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <MotionHeader t={t} title={title} subtitle={subtitle} />
      </div>
      <div className="max-w-3xl mx-auto space-y-4">
        {
          displayedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === item.id ? null : item.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800 pr-4">
                  {t(item.question)}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openIndex === item.id ? 'rotate-180' : ''
                    }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6">
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed pt-4">
                          {t(item.answer)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        }
      </div>

      {hasMore && (
        <div className="text-center mt-6">
          <Button variant="outline" size="sm" onClick={toggleExpand}>
            {t(isExpanded ? { zh: '收起部分', en: 'Show Less' } : { zh: '查看更多', en: 'View More' })}
          </Button>
        </div>
      )}

    </section>
  );
}
