import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { motion } from 'framer-motion';
import OptimizedImage from '@/runtime/components/OptimizedImage';
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface GalleryItem {
  src: string;
  caption?: Translation;
}

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface GalleryContent {
  title?: Translation;
  subtitle?: Translation;
  items?: GalleryItem[];
}

export interface GalleryProps {
  content: GalleryContent;
  lang: Language;
}


export default function Gallery({
  content:{
    title,
    subtitle,
    items = [],
  },
  lang,
}: GalleryProps) {
  const translate = createTranslate(lang);
  const titleText = title ? translate(title) : "";
  const subtitleText = subtitle ? translate(subtitle) : "";

  const viewItems = (items ?? []).map((item) => ({
    src: item.src,
    captionText: item.caption ? translate(item.caption) : "",
  }));

  const labels = {
    viewImage: lang === "zh" ? "查看图片" : "View image",
    imagePreview: lang === "zh" ? "图片预览" : "Image preview",
    closePreview: lang === "zh" ? "关闭图片预览" : "Close image preview",
    previousImage: lang === "zh" ? "上一张图片" : "Previous image",
    nextImage: lang === "zh" ? "下一张图片" : "Next image",
  };

  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedImage === null) return;
    const previousActive = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedImage(null);
      if (event.key === 'ArrowLeft') setSelectedImage((current) => current === null ? null : (current - 1 + viewItems.length) % viewItems.length);
      if (event.key === 'ArrowRight') setSelectedImage((current) => current === null ? null : (current + 1) % viewItems.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previousActive?.focus();
    };
  }, [viewItems.length, selectedImage]);

  if (!viewItems || viewItems.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          {titleText && <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">{titleText}</h2>}
          {subtitleText && <p className="text-md md:text-lg text-gray-600">{subtitleText}</p>}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 px-4"
        >
          {viewItems.map((img, i) => (
            <motion.button
              type="button"
              key={i}
              variants={itemVariants}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(i)}
              aria-label={`${labels.viewImage} ${i + 1}: ${img.captionText ?? ''}`}
            >
              <OptimizedImage
                src={img.src}
                alt={img.captionText ?? ''}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                  <ZoomIn className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm">{img.captionText}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
 
        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label={labels.imagePreview}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
              aria-label={labels.closePreview}
            >
              <X className="w-8 h-8" />
            </button>
            <button
              type="button"
              className="absolute left-4 text-white hover:text-gray-300"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedImage((prev) => (prev! - 1 + viewItems.length) % viewItems.length);
              }}
              aria-label={labels.previousImage}
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
            <OptimizedImage
              src={viewItems[selectedImage].src}
              alt={viewItems[selectedImage].captionText ?? ''}
              width={1200}
              className="max-w-4xl max-h-[80vh] object-contain"
              onClick={(event) => event.stopPropagation()}
            />
            <button
              type="button"
              className="absolute right-4 text-white hover:text-gray-300"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedImage((prev) => (prev! + 1) % viewItems.length);
              }}
              aria-label={labels.nextImage}
            >
              <ChevronRight className="w-12 h-12" />
            </button>
            <div className="absolute bottom-8 text-white text-center">
              <p className="text-lg">{viewItems[selectedImage].captionText}</p>
              <p className="text-sm opacity-60">{selectedImage + 1} / {viewItems.length}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
