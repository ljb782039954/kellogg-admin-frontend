import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language } from "@/cms/types";
import type { LilianImageItem } from "../../types/common";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface ImagePairGridContent {
  images: [LilianImageItem, LilianImageItem];
}

export interface ImagePairGridProps {
  content?: ImagePairGridContent;
  lang?: Language;
}

export default function ImagePairGrid({ content, lang = "en" }: ImagePairGridProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const resolvedImages = (content.images || []).map((item) => ({
    image: item.image,
    imageAlt: t(item.imageAlt),
    caption: t(item.caption),
  }));

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-2 gap-4">
        {resolvedImages.map((item) => (
          <div key={item.image} className="overflow-hidden rounded-sm aspect-[3/4]">
            <OptimizedImage
              src={item.image}
              alt={item.imageAlt || item.caption || ""}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, 560px"
            />
          </div>
        ))}
      </div>
      {resolvedImages.some((item) => item.caption) && (
        <div className="flex justify-between mt-3 text-xs text-body">
          {resolvedImages.map((item) => (
            <span key={`${item.image}-caption`}>{item.caption}</span>
          ))}
        </div>
      )}
    </section>
  );
}


