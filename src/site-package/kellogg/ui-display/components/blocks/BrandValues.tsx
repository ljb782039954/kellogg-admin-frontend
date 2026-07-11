import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import RichText from "@/runtime/components/RichText";
import type { Translation, Language } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

export interface BrandItem {
  id: number;
  icon: string;
  title: Translation;
  description: Translation;
}

export interface BrandValuesContent{
  title?: Translation;
  subtitle?: Translation;
  items?: BrandItem[];
}
export interface BrandValuesProps {
  content: BrandValuesContent;
  lang: Language;
}

export default function BrandValues({ content: {title, subtitle, items = []}, lang }: BrandValuesProps) {
  if (items.length === 0) return null;
  const t = createTranslate(lang);

  return (
    <section className="py-12 w-full">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">{t(title)}</h2>
            {subtitle && <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600">{t(subtitle)}</p>}
          </div>
        )}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] justify-between max-w-6xl mx-auto gap-2 md:gap-4">
          {items.map((item) => {
            const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon] || LucideIcons.Star;
            return (
              <div key={item.id} className="text-center group">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium mb-1">{t(item.title)}</h4>
                <RichText value={t(item.description)} className="text-sm content-rich-text" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
