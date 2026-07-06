import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { ImageGridItemProps } from "./ImagePairGrid";

export interface Categories2Props {
  items: ImageGridItemProps[];
}

export default function Categories2({ items }: Categories2Props) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-center gap-8 flex-wrap">
        {items.map((item, index) => (
          <div key={`${item.image}-${index}`} className="text-center group cursor-pointer">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mx-auto mb-3 border-2 border-border group-hover:border-border transition-colors">
              <OptimizedImage
                src={item.image}
                alt={item.imageAlt || item.caption || ""}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="112px"
              />
            </div>
            {item.caption && <p className="text-xs text-body group-hover:text-ink-strong transition-colors">{item.caption}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}



