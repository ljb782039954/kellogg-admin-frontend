import { Star } from "lucide-react";
import OptimizedImage from "@/runtime/components/OptimizedImage";

export interface Testimonial {
  id: number;
  nameText: string;
  roleText?: string;
  contentText: string;
  avatar?: string;
}

export interface TestimonialsProps {
  titleText?: string;
  subtitleText?: string;
  items?: Testimonial[];
}

export default function Testimonials({ titleText = "", subtitleText = "", items = [] }: TestimonialsProps) {
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
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  {item.avatar && <OptimizedImage src={item.avatar} alt="" width={80} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <div className="font-medium text-sm">{item.nameText}</div>
                  {item.roleText && <div className="text-xs text-gray-500">{item.roleText}</div>}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{item.contentText}</p>
              <div className="flex mt-3">
                {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} className="fill-yellow-400 text-yellow-400" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
