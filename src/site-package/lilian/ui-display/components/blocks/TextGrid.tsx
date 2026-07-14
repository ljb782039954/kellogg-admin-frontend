import RichText from "@/runtime/components/RichText";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface TextGridContent {
  items: Array<{
    title: Translation;
    text: Translation;
  }>;
}

export interface TextGridProps {
  content: TextGridContent;
  lang: Language;
}

export default function TextGrid({ content, lang = "en", }: TextGridProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const resolvedItems = (content.items || []).map((item) => ({ title: t(item.title), text: t(item.text) }));

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
        {resolvedItems.map((item, i) => (
          <div key={i}>
            <h4
              className="text-xs md:text-sm font-semibold tracking-wider uppercase mb-2"
              style={{ color: "var(--color-ink)" }}
            >
              {item.title}
            </h4>
            <RichText value={item.text} className="text-xs md:text-sm leading-relaxed text-subtle"/>
          </div>
        ))}
      </div>
    </section>
  );
}


