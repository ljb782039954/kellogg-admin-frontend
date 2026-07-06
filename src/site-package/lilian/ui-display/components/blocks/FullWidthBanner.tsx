import OptimizedImage from "@/runtime/components/OptimizedImage";

export interface FullWidthBannerProps {
  image: string;
  imageAlt?: string;
  height?: "small" | "medium" | "large";
}

const heightClass = {
  small: "h-[220px]",
  medium: "h-[280px]",
  large: "h-[420px]",
};

export default function FullWidthBanner({
  image,
  imageAlt = "Banner",
  height = "medium",
}: FullWidthBannerProps) {
  return (
    <section className="w-full py-12">
      <div className={`overflow-hidden ${heightClass[height]}`}>
        <OptimizedImage src={image} alt={imageAlt} className="w-full h-full object-cover" sizes="100vw" />
      </div>
    </section>
  );
}



