import OptimizedImage from "@/runtime/components/OptimizedImage";
import RichText from "@/runtime/components/RichText";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface ImageTextSplitContent {
  eyebrow?: Translation;
  title?: Translation;
  content?: Translation;
  image: string;
  imageAlt?: Translation;
  imagePosition?: "left" | "right";
}

export interface ImageTextSplitProps {
  content: ImageTextSplitContent;
  lang: Language;
}

export default function ImageTextSplit({
  content,
  lang = "en",
}: ImageTextSplitProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const resolvedEyebrow = t(content.eyebrow);
  const resolvedTitle = t(content.title);
  const resolvedContent = t(content.content);
  const resolvedImage = content.image || "";
  const resolvedImageAlt = t(content.imageAlt, resolvedTitle);
  const resolvedImagePosition = content.imagePosition || "right";
  const imageFirst = resolvedImagePosition === "left";

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className={imageFirst ? "md:order-2" : ""}>
          {resolvedEyebrow && <span className="text-[10px] tracking-[0.2em] text-subtle uppercase">{resolvedEyebrow}</span>}
          {resolvedTitle && <h3 className="text-xl font-light mt-2 mb-4 font-luxury-heading">{resolvedTitle}</h3>}
          {resolvedContent && <RichText value={resolvedContent} className="text-sm text-body leading-relaxed" />}
        </div>
        <div className={`overflow-hidden rounded-sm aspect-[4/5] ${imageFirst ? "md:order-1" : ""}`}>
          <OptimizedImage
            src={resolvedImage}
            alt={resolvedImageAlt || resolvedTitle}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 560px"
          />
        </div>
      </div>
    </section>
  );
}


