import * as LucideIcons from "lucide-react";
import RichText from "@/runtime/components/RichText";
import type { LucideIcon } from "lucide-react";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface FeatureListItem {
  icon: string;
  title: Translation;
  description: Translation;
}

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface FeatureListContent {
  title?: Translation;
  subtitle?: Translation;
  items?: FeatureListItem[];
}

export interface FeatureListProps {
  content: FeatureListContent;
  lang: Language;
}

export default function FeatureList({
  content,
  lang = "en",
}: FeatureListProps) {
  if (!content) return null;

  const t = createTranslate(lang);
  const resolvedTitle = t(content.title);
  const resolvedSubtitle = t(content.subtitle);
  const resolvedItems = (content.items || []).map((item) => ({
    icon: item.icon,
    titleText: t(item.title),
    descriptionText: t(item.description),
  }));

  if (resolvedItems.length === 0) return null;

  return (
    <section className="px-6 py-12 bg-page">
      <div className="max-w-6xl mx-auto">
        {(resolvedTitle || resolvedSubtitle) && (
          <div className="max-w-2xl mb-10">
            {resolvedTitle && <h2 className="font-luxury-heading text-3xl md:text-4xl font-light">{resolvedTitle}</h2>}
            {resolvedSubtitle && <p className="mt-3 text-sm md:text-base text-body">{resolvedSubtitle} </p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resolvedItems.map((item, index) => {
            const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon] || LucideIcons.Sparkles;

            return (
              <div key={`${item.icon}-${index}`} className="bg-surface border border-border rounded-md p-6">
                <div className="w-11 h-11 border border-border flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-ink-strong" />
                </div>
                <h3 className="font-luxury-heading text-xl mb-3">{item.titleText}</h3>
                <RichText value={item.descriptionText} className="text-sm leading-6 text-body" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


