import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface ParallaxImageContent {
  image: string;
  imageAlt?: Translation;
  eyebrow?: Translation;
  title?: Translation;
  height?: "medium" | "large";
}

export interface ParallaxImageProps {
  content: ParallaxImageContent;
  lang: Language;
}

const heightClass = {
  medium: "h-[60vh]",
  large: "h-[75vh]",
};

export default function ParallaxImage({
  content,
  lang = "en",
}: ParallaxImageProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const resolvedImage = content.image || "";
  const resolvedTitle = t(content.title);
  const resolvedEyebrow = t(content.eyebrow);
  const resolvedImageAlt = t(content.imageAlt, resolvedTitle);
  const resolvedHeight = content.height || "medium";

  return (
    <section className={`relative ${heightClass[resolvedHeight]}`}>
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src={resolvedImage}
          alt={resolvedImageAlt || resolvedTitle}
          className="w-full h-[120%] object-cover absolute -top-[10%]"
          sizes="100vw"
          priority
        />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-on-dark">
          {resolvedEyebrow && <p className="text-[10px] tracking-[0.3em] uppercase mb-3 text-on-dark-soft">{resolvedEyebrow}</p>}
          {resolvedTitle && (
            <h3 className="text-3xl sm:text-4xl font-light font-luxury-heading [text-shadow:0_2px_20px_rgba(0,0,0,0.3)]">
              {resolvedTitle}
            </h3>
          )}
        </div>
      </div>
    </section>
  );
}


