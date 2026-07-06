import OptimizedImage from "@/runtime/components/OptimizedImage";
import RichText from "@/runtime/components/RichText";

export interface BlogGridItem {
  id: string;
  href: string;
  titleText: string;
  summaryText?: string;
  categoryText?: string;
  dateText?: string;
  image?: string;
}

export interface BlogGridProps {
  titleText?: string;
  subtitleText?: string;
  items?: BlogGridItem[];
}

export default function BlogGrid({ titleText = "", subtitleText = "", items = [] }: BlogGridProps) {
  if (items.length === 0) return null;

  return (
    <section className="px-6 py-12 bg-surface">
      <div className="max-w-6xl mx-auto">
        {(titleText || subtitleText) && (
          <div className="text-center mb-10">
            {titleText && <h2 className="font-luxury-heading text-3xl md:text-4xl font-light">{titleText}</h2>}
            {subtitleText && <RichText value={subtitleText} className="mt-3 text-sm md:text-base text-body max-w-2xl mx-auto" />}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <a key={item.id} href={item.href} className="group block">
              <article className="h-full overflow-hidden rounded-md border border-border bg-surface">
                <div className="aspect-[4/3] overflow-hidden bg-media">
                  {item.image ? (
                    <OptimizedImage
                      src={item.image}
                      alt={item.titleText}
                      width={720}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-subtle">No Image</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase text-subtle">
                    {item.categoryText && <span>{item.categoryText}</span>}
                    {item.dateText && <span>{item.dateText}</span>}
                  </div>
                  <h3 className="mt-3 font-luxury-heading text-xl leading-snug">{item.titleText}</h3>
                  {item.summaryText && <RichText value={item.summaryText} className="mt-3 text-sm leading-6 text-body line-clamp-3" />}
                </div>
              </article>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}



