import OptimizedImage from "@/runtime/components/OptimizedImage";

export interface ImageQuadGridProps {
  images: ImageGridItemProps[];
}


export interface ImageGridItemProps {
  image: string;
  imageAlt?: string;
  caption?: string;
}

export interface ImagePairGridProps {
  images: [ImageGridItemProps, ImageGridItemProps];
}

export default function ImagePairGrid({ images }: ImagePairGridProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-2 gap-4">
        {images.map((item) => (
          <div key={item.image} className="overflow-hidden rounded-sm aspect-[3/4]">
            <OptimizedImage
              src={item.image}
              alt={item.imageAlt || item.caption || ""}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, 560px"
            />
          </div>
        ))}
      </div>
      {images.some((item) => item.caption) && (
        <div className="flex justify-between mt-3 text-xs text-body">
          {images.map((item) => (
            <span key={`${item.image}-caption`}>{item.caption}</span>
          ))}
        </div>
      )}
    </section>
  );
}



