import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from '@/runtime/components/OptimizedImage';
import type { Language, NavLink, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface CarouselItem {
  id: number;
  image: string;
  title: Translation;
  subtitle?: Translation;
  cta?: Translation;
  link: NavLink;
}
// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface CarouselContent {
  autoPlay?: boolean;
  interval?: number;
  items?: CarouselItem[];
}

export interface CarouselProps {
  content: CarouselContent;
  lang: Language;
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

function decodeHtml(html: string) {
  return (html || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

export default function Carousel({ 
  content: {
    items = [], 
    autoPlay = true, 
    interval = 5000,
  },
  lang,
}: CarouselProps) {
  const translate = createTranslate(lang);
  const regionLabel = lang === "zh" ? "精选内容轮播" : "Featured content carousel";
  const previousLabel = lang === "zh" ? "上一张" : "Previous slide";
  const nextLabel = lang === "zh" ? "下一张" : "Next slide";
  const goToSlideLabelPrefix = lang === "zh" ? "转到第" : "Go to slide";

  const viewItems = (items ?? []).map((item) => ({
    id: item.id,
    image: item.image,
    titleText: translate(item.title),
    subtitleText: item.subtitle ? decodeHtml(translate(item.subtitle)) : "",
    ctaText: item.cta ? translate(item.cta) : "",
    href: item.link?.href || "#",
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    if (viewItems.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % viewItems.length);
  }, [viewItems.length]);

  const prevSlide = useCallback(() => {
    if (viewItems.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + viewItems.length) % viewItems.length);
  }, [viewItems.length]);

  useEffect(() => {
    if (!autoPlay || !viewItems.length) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlay, interval, viewItems.length]);

  if (!viewItems || viewItems.length === 0) return null;

  const slide = viewItems[currentIndex];

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
        {viewItems.map((_, index) => (
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
