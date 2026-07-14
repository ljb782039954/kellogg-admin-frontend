import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface FullscreenImageBackgroundContent {
  image: string;
  imageAlt?: Translation;
  eyebrow?: Translation;
  title?: Translation;
  overlay?: boolean;
}

export interface FullscreenImageBackgroundProps {
  content: FullscreenImageBackgroundContent;
  lang: Language;
}

export default function FullscreenImageBackground({
  content,
  lang = "en",
}: FullscreenImageBackgroundProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const resolvedImage = content.image || "";
  const resolvedTitle = t(content.title);
  const resolvedEyebrow = t(content.eyebrow);
  const resolvedImageAlt = t(content.imageAlt, resolvedTitle || resolvedEyebrow);
  const resolvedOverlay = content.overlay ?? true;

  return (
    <section className="relative overflow-hidden h-[60vh]">
      <OptimizedImage
        src={resolvedImage}
        alt={resolvedImageAlt || resolvedTitle || resolvedEyebrow}
        width={1440}
        className="absolute inset-0 w-full h-full object-cover"
        sizes="100vw"
        priority
      />
      {resolvedOverlay && <div className="absolute inset-0 bg-overlay-soft" />}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-on-dark">
          {resolvedEyebrow && <p className="text-[10px] tracking-[0.3em] uppercase mb-3 text-on-dark-soft">{resolvedEyebrow}</p>}
          {resolvedTitle && <h3 className="text-3xl font-light font-luxury-heading">{resolvedTitle}</h3>}
        </div>
      </div>
    </section>
  );
}


