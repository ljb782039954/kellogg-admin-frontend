import OptimizedImage from "@/runtime/components/OptimizedImage";
import { useState } from "react";
import type { ImageGridItemProps } from "./ImagePairGrid";

export interface LightboxGalleryProps {
  images: ImageGridItemProps[];
}

export default function LightboxGallery({ images }: LightboxGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const activeImage = openIndex === null ? null : images[openIndex];

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4  gap-2">
        {images.map((item, index) => (
          <button key={`${item.image}-${index}`} onClick={() => setOpenIndex(index)} className="overflow-hidden rounded-sm aspect-square">
            <OptimizedImage
              src={item.image}
              alt={item.imageAlt || item.caption || ""}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
              sizes="(max-width: 640px) 33vw, 180px"
            />
          </button>
        ))}
      </div>
      {activeImage && openIndex !== null && (
        <div className="fixed inset-0 z-50 bg-overlay-strong flex items-center justify-center" onClick={() => setOpenIndex(null)}>
          <button className="absolute top-4 right-4 text-on-dark text-2xl" onClick={() => setOpenIndex(null)}>脳</button>
          <button className="absolute left-4 text-on-dark text-xl" onClick={(event) => { event.stopPropagation(); setOpenIndex(openIndex > 0 ? openIndex - 1 : images.length - 1); }}>
            &larr;
          </button>
          <button className="absolute right-4 text-on-dark text-xl" onClick={(event) => { event.stopPropagation(); setOpenIndex(openIndex < images.length - 1 ? openIndex + 1 : 0); }}>
            &rarr;
          </button>
          <OptimizedImage
            src={activeImage.image}
            alt={activeImage.imageAlt || activeImage.caption || ""}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            sizes="90vw"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}



