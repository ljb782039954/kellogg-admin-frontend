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
    <section className="py-12 w-full">
      <div className="container mx-auto px-4">
        {titleText && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">{titleText}</h2>
            {subtitleText && <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600">{subtitleText}</p>}
          </div>
        )}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 md:gap-6">
          {items.map((item, index) => {
            const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon] || LucideIcons.Star;
            return (
              <div key={`${item.icon}-${index}`} className="bg-gray-50 rounded-xl p-6 hover:bg-primary/5 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{item.titleText}</h4>
                <RichText value={item.descriptionText} className="text-sm text-gray-500 content-rich-text" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
