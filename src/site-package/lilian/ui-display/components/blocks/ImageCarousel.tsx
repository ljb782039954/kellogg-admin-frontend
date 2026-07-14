import { useEffect, useState } from "react";
import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language } from "@/cms/types";
import type { LilianImageItem } from "../../types/common";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface ImageCarouselContent {
  images: LilianImageItem[];
  autoplay?: boolean;
  interval?: number;
}

export interface ImageCarouselProps {
  content: ImageCarouselContent;
  lang: Language;
}

export default function ImageCarousel({ content : {images = [], autoplay = true, interval = 4000}, lang = "en",  }: ImageCarouselProps) {
  const t = createTranslate(lang);
  const resolvedAutoplay = autoplay;
  const resolvedInterval = interval;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!resolvedAutoplay || images.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % images.length), resolvedInterval);
    return () => clearInterval(timer);
  }, [resolvedAutoplay, resolvedInterval, images.length]);

  if (images.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="relative overflow-hidden rounded-sm aspect-video">
        {images.map((item, index) => (
          <div
            key={`${item.image}-${index}`}
            className={`absolute inset-0 transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"}`}
          >
            <OptimizedImage
              src={item.image}
              alt={t(item.imageAlt) || t(item.caption) || ""}
              className="w-full h-full object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        ))}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === current ? "bg-surface w-4" : "bg-on-dark-faint"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


