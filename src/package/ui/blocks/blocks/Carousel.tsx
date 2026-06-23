import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Translation, NavLink } from '@/types';

export interface CarouselValues {
  id: number;
  image: string;
  title: Translation;
  subtitle?: Translation;
  cta?: Translation;
  link: NavLink;
}

export interface CarouselProps {
  autoPlay?: boolean;
  interval?: number;
  items?: CarouselValues[];
}

interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: CarouselProps;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

export default function Carousel({ t, props }: Props) {
  const { items, autoPlay = true, interval } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);


  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // 自动轮播
  useEffect(() => {
    if (!autoPlay || !items.length) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlay, interval, items.length]);

  // 如果没有数据，直接返回null
  if (!items || items.length === 0) return null;

  const slide = items[currentIndex];
  if (!slide) return null;

  const style = {
    title: 'text-white',
    subtitle: 'text-white/80',
    button: 'bg-white text-gray-900 hover:bg-gray-100',
    indicator: 'bg-white/50 hover:bg-white',
    activeIndicator: 'bg-white',
    arrow: 'bg-white/20 hover:bg-white/30 text-white',
  };



  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-gray-900">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={t(slide.title)}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-4 ${style.title}`}
              >
                {t(slide.title)}
              </motion.h2>
              {slide.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className={`text-lg md:text-xl mb-8 ${style.subtitle}`}
                >
                  {t(slide.subtitle)}
                </motion.p>
              )}
              {slide.cta && (
                <motion.a
                  href={slide.link?.href || '#'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className={`inline-block px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 ${style.button}`}
                >
                  {t(slide.cta)}
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 ${style.arrow}`}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 ${style.arrow}`}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? style.activeIndicator : style.indicator
              }`}
          />
        ))}
      </div>
    </div>
  );
}
