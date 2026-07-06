import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import RichText from "@/runtime/components/RichText";

export interface FeatureListItem {
  icon: string;
  titleText: string;
  descriptionText: string;
}

export interface FeatureListProps {
  titleText?: string;
  subtitleText?: string;
  items?: FeatureListItem[];
}

export default function FeatureList({ titleText = "", subtitleText = "", items = [] }: FeatureListProps) {
  if (items.length === 0) return null;

  return (
    <section className="px-6 py-12 bg-page">
      <div className="max-w-6xl mx-auto">
        {(titleText || subtitleText) && (
          <div className="max-w-2xl mb-10">
            {titleText && <h2 className="font-luxury-heading text-3xl md:text-4xl font-light">{titleText}</h2>}
            {subtitleText && <RichText value={subtitleText} className="mt-3 text-sm md:text-base text-body" />}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item, index) => {
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



