import { useEffect, useRef, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import OptimizedImage from '@/runtime/components/OptimizedImage';
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface ImageFullContent {
  image?: string;
  description?: Translation;
  alt?: Translation;
  width?: 'small' | 'medium' | 'large' | 'full';
  height?: 'small' | 'medium' | 'large' | 'full';
  overlay?: boolean;
}
export interface ImageFullProps {
  content: ImageFullContent
  lang: Language;
}

export default function ImageFull({
  content:{
    image,
    alt,
    height = 'medium',
    width = 'full',
    overlay = false,
    description
  },
  lang,
}: ImageFullProps) {
  const t = createTranslate(lang);
  const descriptionText = description ? t(description) : "";
  const altText = alt ? t(alt) : "";

  const labels = {
    noImage: lang === "zh" ? "未选择图片" : "No image selected",
    openFullscreen: lang === "zh" ? "打开全屏图片" : "Open fullscreen image",
    fullscreenPreview: lang === "zh" ? "全屏图片预览" : "Fullscreen image preview",
    closeFullscreen: lang === "zh" ? "关闭全屏图片" : "Close fullscreen image",
  };
  const [isFullscreen, setIsFullscreen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousActive = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previousActive?.focus();
    };
  }, [isFullscreen]);

  const heightClasses = {
    small: 'h-48 md:h-64',
    medium: 'h-64 md:h-[400px]',
    large: 'h-96 md:h-[600px]',
    full: 'h-screen',
  };

  const widthClasses = {
    small: 'max-w-2xl mx-auto px-4 my-8',
    medium: 'max-w-4xl mx-auto px-4 my-8',
    large: 'max-w-6xl mx-auto px-4 my-8',
    full: 'w-full',
  };

  if (!image) {
    return (
      <div className={`${heightClasses[height]} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg m-4`}>
        <div className="text-gray-400 flex flex-col items-center gap-2">
          <Maximize2 className="w-8 h-8" />
          <span>{labels.noImage}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={widthClasses[width]}>
        <button
          type="button"
          className={`relative w-full ${heightClasses[height]} overflow-hidden group cursor-zoom-in transition-all duration-500 rounded-lg shadow-sm`}
          onClick={() => setIsFullscreen(true)}
          aria-label={labels.openFullscreen}
        >
          <OptimizedImage
            src={image}
            alt={altText}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {overlay && (
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300 flex flex-col items-center justify-center text-white p-6 text-center">
              {descriptionText && (
                <p className="text-lg md:text-2xl font-medium max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {descriptionText}
                </p>
              )}
            </div>
          )}

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 p-2 rounded-full shadow-lg">
              <Maximize2 className="w-5 h-5 text-gray-800" />
            </div>
          </div>
        </button>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setIsFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={labels.fullscreenPreview}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
            onClick={(event) => {
              event.stopPropagation();
              setIsFullscreen(false);
            }}
            aria-label={labels.closeFullscreen}
          >
            <X className="w-8 h-8" />
          </button>

          <OptimizedImage
            src={image}
            alt={altText}
            className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300"
            width={1280}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
