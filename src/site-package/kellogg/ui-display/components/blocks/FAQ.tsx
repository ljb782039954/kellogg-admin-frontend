import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface FAQItem {
  id: number;
  questionText: string;
  answerText: string;
}

export interface FAQLabels {
  showLess: string;
  viewMore: string;
}

export interface FAQProps {
  titleText?: string;
  subtitleText?: string;
  items?: FAQItem[];
  labels?: FAQLabels;
  structuredData?: string;
}

const fallbackLabels: FAQLabels = {
  showLess: 'Show Less',
  viewMore: 'View More',
};

export default function FAQ({
  titleText = '',
  subtitleText = '',
  items = [],
  labels = fallbackLabels,
  structuredData,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasMore = items.length > 5;
  const displayedItems = isExpanded ? items : items.slice(0, 5);

  if (!items || items.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          {titleText && <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">{titleText}</h2>}
          {subtitleText && <p className="text-gray-500 text-md md:text-lg">{subtitleText}</p>}
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {displayedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === item.id ? null : item.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === item.id}
                aria-controls={`faq-answer-${item.id}`}
              >
                <span className="font-medium text-gray-800 pr-4">
                  {item.questionText}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openIndex === item.id ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {openIndex === item.id && (
                  <motion.div
                    id={`faq-answer-${item.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6">
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed pt-4">
                          {item.answerText}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              {isExpanded ? labels.showLess : labels.viewMore}
            </button>
          </div>
        )}
      </div>

      {structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />}
    </section>
  );
}
