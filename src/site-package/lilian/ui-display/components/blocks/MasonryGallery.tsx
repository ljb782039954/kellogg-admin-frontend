import OptimizedImage from "@/runtime/components/OptimizedImage";

export interface MasonryGalleryImageProps {
  image: string;
  imageAlt?: string;
  caption?: string;
  heightClass?: string;
}

export interface MasonryGalleryProps {
  images: MasonryGalleryImageProps[];
}

export default function MasonryGallery({ images }: MasonryGalleryProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="columns-2 md:columns-3 gap-3">
        {images.map((item, index) => (
          <div
            key={`${item.image}-${index}`}
            className={`${item.heightClass || "h-72"} overflow-hidden rounded-sm mb-3 break-inside-avoid`}
          >
            <OptimizedImage
              src={item.image}
              alt={item.imageAlt || item.caption || ""}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, 400px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}



