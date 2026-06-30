import * as LucideIcons from 'lucide-react';
import MotionHeader from '../custom/motionHeader';
import { motion } from 'framer-motion';
import type { Translation } from '@/types';

export interface Testimonial {
  id: number;
  name: Translation;
  role?: Translation;
  content: Translation;
  avatar?: string;
}
export interface TestimonialProps {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
  items?: Testimonial[];
}

interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: TestimonialProps;
}

export default function Testimonials({ t, props }: Props) {
  const { title, subtitle, items } = props;

  // 如果没有数据，直接返回null
  if (!items || items.length === 0) return null;

  return (
    <section className="py-12 w-full">
      <div className='container mx-auto px-4'>
        <MotionHeader t={t} title={title} subtitle={subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  {item.avatar && (
                    <img src={item.avatar} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">{t(item.name)}</div>
                  <div className="text-xs text-gray-500">{t(item.role)}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{t(item.content)}</p>
              <div className="flex mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <LucideIcons.Star
                    key={star}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
