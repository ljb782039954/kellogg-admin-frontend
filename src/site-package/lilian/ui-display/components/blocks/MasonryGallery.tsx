import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language } from "@/cms/types";
import type { LilianImageItem } from "../../types/common";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface MasonryGalleryImageContent extends LilianImageItem {
  heightClass?: string;
}

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface MasonryGalleryContent {
  images: MasonryGalleryImageContent[];
}

export interface MasonryGalleryProps {
  content: MasonryGalleryContent;
  lang: Language;
}

export default function MasonryGallery({ content, lang = "en"}: MasonryGalleryProps) {
  const t = createTranslate(lang);
  const resolvedImages = content.images.map((item) => ({
        image: item.image,
        imageAlt: t(item.imageAlt),
        caption: t(item.caption),
        heightClass: item.heightClass,
      }));

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="columns-2 md:columns-3 gap-3">
        {resolvedImages.map((item, index) => (
          <div
            key={`${item.image}-${index}`}
            className={`${item.heightClass || "h-72"} overflow-hidden rounded-sm mb-3 break-inside-avoid`}
          >
            <OptimizedImage
              src={item.image}
              alt={item.imageAlt || item.caption || ""}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, 400px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}


