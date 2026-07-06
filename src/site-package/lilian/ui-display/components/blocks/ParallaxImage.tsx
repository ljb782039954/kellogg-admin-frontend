import OptimizedImage from "@/runtime/components/OptimizedImage";

export interface ParallaxImageProps {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  titleText?: string;
  height?: "medium" | "large";
}

const heightClass = {
  medium: "h-[60vh]",
  large: "h-[75vh]",
};

export default function ParallaxImage({
  image,
  imageAlt = "",
  eyebrow = "",
  titleText = "",
  height = "medium",
}: ParallaxImageProps) {
  return (
    <section className={`relative ${heightClass[height]}`}>
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src={image}
          alt={imageAlt || titleText}
          className="w-full h-[120%] object-cover absolute -top-[10%]"
          sizes="100vw"
          priority
        />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-on-dark">
          {eyebrow && <p className="text-[10px] tracking-[0.3em] uppercase mb-3 text-on-dark-soft">{eyebrow}</p>}
          {titleText && (
            <h3 className="text-3xl sm:text-4xl font-light font-luxury-heading [text-shadow:0_2px_20px_rgba(0,0,0,0.3)]">
              {titleText}
            </h3>
          )}
        </div>
      </div>
    </section>
  );
}



