import OptimizedImage from "@/runtime/components/OptimizedImage";
import RichText from "@/runtime/components/RichText";

export interface CategoryCardItem {
  id: string;
  nameText: string;
  image?: string;
  href?: string;
}

export interface CategoriesProps {
  titleText?: string;
  subtitleText?: string;
  items?: CategoryCardItem[];
}

export default function Categories({ titleText = "", subtitleText = "", items = [] }: CategoriesProps) {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <a key={item.id} href={item.href || "#"} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-media">
                {item.image ? (
                  <OptimizedImage
                    src={item.image}
                    alt={item.nameText}
                    width={720}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-subtle">No Image</div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-5">
                  <h3 className="font-luxury-heading text-2xl text-on-dark">{item.nameText}</h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}



