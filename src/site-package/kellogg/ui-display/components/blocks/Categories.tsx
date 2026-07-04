import OptimizedImage from "@/runtime/components/OptimizedImage";

export interface CategoryViewItem {
  id: string;
  nameText: string;
  image?: string;
}

export interface CategoriesProps {
  items?: CategoryViewItem[];
}

export default function Categories({ items = [] }: CategoriesProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {items.map((category) => (
            <div key={category.id} className="text-center group cursor-pointer">
              <div className="w-full aspect-[1/1.5] max-w-[60px] mx-auto bg-white rounded-full overflow-hidden flex items-center justify-center shadow-sm mb-2 group-hover:shadow-md group-hover:scale-105 transition-all">
                {category.image ? (
                  <OptimizedImage src={category.image} alt={category.nameText} width={120} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-300">No Image</span>
                )}
              </div>
              <span className="text-sm font-medium group-hover:text-primary transition-colors">{category.nameText}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
