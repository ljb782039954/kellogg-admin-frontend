import { useEffect, useState } from "react";
import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { ImageGridItemProps } from "./ImagePairGrid";

export interface ImageCarouselProps {
  images: ImageGridItemProps[];
  autoplay?: boolean;
  interval?: number;
}

export default function ImageCarousel({ images, autoplay = true, interval = 4000 }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoplay || images.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % images.length), interval);
    return () => clearInterval(timer);
  }, [autoplay, interval, images.length]);

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
              alt={item.imageAlt || item.caption || ""}
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



