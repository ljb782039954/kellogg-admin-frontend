import OptimizedImage from "@/runtime/components/OptimizedImage";
import RichText from "@/runtime/components/RichText";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface BrochureDownloadContent {
  image: string;
  imageAlt?: Translation;
  eyebrow?: Translation;
  title?: Translation;
  description?: Translation;
  buttonText?: Translation;
  fileMeta?: Translation;
  href?: string;
}

export interface BrochureDownloadProps {
  content: BrochureDownloadContent;
  lang: Language;
}

export default function BrochureDownload({
  content,
  lang = "en",
}: BrochureDownloadProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const resolvedImage = content.image || "";
  const resolvedTitle = t(content.title);
  const resolvedImageAlt = t(content.imageAlt, resolvedTitle);
  const resolvedEyebrow = t(content.eyebrow);
  const resolvedDescription = t(content.description);
  const resolvedButtonText = t(content.buttonText);
  const resolvedFileMeta = t(content.fileMeta);
  const resolvedHref = content.href || "#";

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-panel rounded-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="overflow-hidden aspect-[3/4]">
            <OptimizedImage src={resolvedImage} alt={resolvedImageAlt || resolvedTitle} className="w-full h-full object-cover" sizes="(max-width: 768px) 100vw, 420px" />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            {resolvedEyebrow && <p className="text-[10px] tracking-[0.2em] text-subtle uppercase mb-3">{resolvedEyebrow}</p>}
            {resolvedTitle && <h3 className="text-lg font-light mb-4 font-luxury-heading">{resolvedTitle}</h3>}
            {resolvedDescription && <RichText value={resolvedDescription} className="text-xs text-body leading-relaxed mb-6" />}
            <div className="flex items-center gap-4">
              {resolvedButtonText && <a href={resolvedHref} className="px-6 py-2.5 bg-ink-strong text-on-dark text-xs tracking-wider hover:bg-ink transition-colors">{resolvedButtonText}</a>}
              {resolvedFileMeta && <span className="text-[10px] text-subtle">{resolvedFileMeta}</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


