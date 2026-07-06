import OptimizedImage from "@/runtime/components/OptimizedImage";
import RichText from "@/runtime/components/RichText";

export interface TestimonialMasonryItemProps {
  name: string;
  company?: string;
  avatar?: string;
  text: string;
  rating?: number;
}

export interface TestimonialMasonryProps {
  reviews: TestimonialMasonryItemProps[];
}

export default function TestimonialMasonry({ reviews }: TestimonialMasonryProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {reviews.map((item, index) => (
          <div key={`${item.name}-${index}`} className={`bg-panel p-5 rounded-md mb-4 break-inside-avoid`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-preview shrink-0">
                {item.avatar ? (
                  <OptimizedImage
                    src={item.avatar}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-body">
                    {item.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm md:text-base font-medium">{item.name}</p>
                {item.company && <p className="text-xs md:text-sm text-subtle">{item.company}</p>}
              </div>
            </div>
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: item.rating || 5 }).map((_, starIndex) => (
                <span key={starIndex} className="text-rating text-xs md:text-sm">★</span>
              ))}
            </div>
            <RichText value={`"${item.text}"`} className="text-xs md:text-sm text-body leading-relaxed" />
          </div>
        ))}
      </div>
    </section>
  );
}



