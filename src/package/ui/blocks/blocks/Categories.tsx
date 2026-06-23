import type { Category } from '@/types';

export interface CategoriesProps {
  showAll?: boolean;
  maxItems?: number;
}

interface Props {
  t: (obj: { zh: string; en: string }) => string; // 翻译函数
  props: CategoriesProps;
  categories: Category[];
}

export default function Categories({ t, props, categories }: Props) {
  const { showAll, maxItems } = props;
  // 如果显示所有，就遍历categories，否则就遍历前maxItems个
  const displayCategories = showAll ? categories : categories.slice(0, maxItems);

  // 如果没有数据，直接返回null
  if (!displayCategories || displayCategories.length === 0) return null;

  return (
    <section className="py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-4">
          {displayCategories.map((cat) => {
            return (
              <div key={cat.id} className="text-center group cursor-pointer">
                <div className="
                  w-full aspect-[1/1.5] max-w-[60px] mx-auto bg-white rounded-full 
                  overflow-hidden flex items-center justify-center shadow-sm mb-2 
                  group-hover:shadow-md group-hover:scale-105 transition-all
                ">
                  <img
                    src={cat.image}
                    alt={t(cat.name)}
                    className="w-full h-full object-cover text-gray-600 group-hover:text-primary transition-colors"
                  />
                </div>
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {t(cat.name)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
