import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from '@/runtime/components/OptimizedImage';

export interface CarouselItemView {
  id: number;
  image: string;
  titleText: string;
  subtitleText?: string;
  ctaText?: string;
  href?: string;
}

export interface CarouselProps {
  autoPlay?: boolean;
  interval?: number;
  items?: CarouselItemView[];
  regionLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  goToSlideLabelPrefix?: string;
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

export default function Carousel({ 
  items = [], 
  autoPlay = true, 
  interval = 5000,
  regionLabel = "Featured content carousel",
  previousLabel = "Previous slide",
  nextLabel = "Next slide",
  goToSlideLabelPrefix = "Go to slide",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    if (items.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    if (items.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!autoPlay || !items.length) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlay, interval, items.length]);

  if (!items || items.length === 0) return null;

  const slide = items[currentIndex];
  if (!slide) return null;

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-gray-900" role="region" aria-roledescription="carousel" aria-label={regionLabel}>
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
          <div className="absolute inset-0">
            <OptimizedImage
              src={slide.image}
              alt={slide.titleText}
              className="w-full h-full object-cover"
              priority={currentIndex === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 lg:mb-8 text-white"
              >
                {slide.titleText}
              </motion.h2>
              {slide.subtitleText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-lg md:text-xl mb-8 text-white/70"
                >
                  {slide.subtitleText}
                </motion.div>
              )}
              {slide.ctaText && (
                <motion.a
                  href={slide.href || '#'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="inline-block px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 bg-white text-gray-900 hover:bg-gray-100"
                >
                  {slide.ctaText}
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 bg-white/20 hover:bg-white/30 text-white"
        aria-label={previousLabel}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 bg-white/20 hover:bg-white/30 text-white"
        aria-label={nextLabel}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {items.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white"
            }`}
            aria-label={`${goToSlideLabelPrefix} ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
