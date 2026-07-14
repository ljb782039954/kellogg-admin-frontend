import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface BrandManifestoContent {
  eyebrow?: Translation;
  quote: Translation;
  attribution?: Translation;
  backgroundColor?: string;
}

export interface BrandManifestoProps {
  content: BrandManifestoContent;
  lang: Language;
}

export default function BrandManifesto({
  content,
  lang = "en",
}: BrandManifestoProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const resolvedEyebrow = t(content.eyebrow);
  const resolvedQuote = t(content.quote) || "";
  const resolvedAttribution = t(content.attribution);
  const resolvedBackgroundColor = content.backgroundColor || "var(--color-ink)";

  return (
    <section className="py-20" style={{ background: resolvedBackgroundColor }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        {resolvedEyebrow && (
          <p className="text-[10px] tracking-[0.3em] text-on-dark-faint uppercase mb-6">
            {resolvedEyebrow}
          </p>
        )}
        <h3
          className="text-2xl sm:text-3xl font-light text-on-dark leading-relaxed whitespace-pre-line"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {resolvedQuote}
        </h3>
        {resolvedAttribution && (
          <p className="text-xs text-on-dark-faint mt-6 tracking-wider">
            {resolvedAttribution}
          </p>
        )}
      </div>
    </section>
  );
}



