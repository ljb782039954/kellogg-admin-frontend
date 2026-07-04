import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { motion } from 'framer-motion';
import OptimizedImage from '@/runtime/components/OptimizedImage';

export interface GalleryValues {
  src: string;
  captionText?: string;
}

export interface GalleryLabels {
  viewImage: string;
  imagePreview: string;
  closePreview: string;
  previousImage: string;
  nextImage: string;
}

export interface GalleryProps {
  titleText?: string;
  subtitleText?: string;
  items?: GalleryValues[];
  labels?: GalleryLabels;
}

const fallbackLabels: GalleryLabels = {
  viewImage: 'View image',
  imagePreview: 'Image preview',
  closePreview: 'Close image preview',
  previousImage: 'Previous image',
  nextImage: 'Next image',
};

export default function Gallery({
  titleText = '',
  subtitleText = '',
  items = [],
  labels = fallbackLabels,
}: GalleryProps) {
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
      if (event.key === 'ArrowLeft') setSelectedImage((current) => current === null ? null : (current - 1 + items.length) % items.length);
      if (event.key === 'ArrowRight') setSelectedImage((current) => current === null ? null : (current + 1) % items.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previousActive?.focus();
    };
  }, [items.length, selectedImage]);

  if (!items || items.length === 0) return null;

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
          {items.map((img, i) => (
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
                setSelectedImage((prev) => (prev! - 1 + items.length) % items.length);
              }}
              aria-label={labels.previousImage}
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
            <OptimizedImage
              src={items[selectedImage].src}
              alt={items[selectedImage].captionText ?? ''}
              width={1200}
              className="max-w-4xl max-h-[80vh] object-contain"
              onClick={(event) => event.stopPropagation()}
            />
            <button
              type="button"
              className="absolute right-4 text-white hover:text-gray-300"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedImage((prev) => (prev! + 1) % items.length);
              }}
              aria-label={labels.nextImage}
            >
              <ChevronRight className="w-12 h-12" />
            </button>
            <div className="absolute bottom-8 text-white text-center">
              <p className="text-lg">{items[selectedImage].captionText}</p>
              <p className="text-sm opacity-60">{selectedImage + 1} / {items.length}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
