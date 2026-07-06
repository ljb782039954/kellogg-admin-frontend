import OptimizedImage from "@/runtime/components/OptimizedImage";

export interface FullscreenImageBackgroundProps {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  titleText?: string;
  overlay?: boolean;
}

export default function FullscreenImageBackground({
  image,
  imageAlt = "",
  eyebrow = "",
  titleText = "",
  overlay = true,
}: FullscreenImageBackgroundProps) {
  return (
    <section className="relative overflow-hidden h-[60vh]">
      <OptimizedImage
        src={image}
        alt={imageAlt || titleText || eyebrow}
        width={1440}
        className="absolute inset-0 w-full h-full object-cover"
        sizes="100vw"
        priority
      />
      {overlay && <div className="absolute inset-0 bg-overlay-soft" />}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-on-dark">
          {eyebrow && <p className="text-[10px] tracking-[0.3em] uppercase mb-3 text-on-dark-soft">{eyebrow}</p>}
          {titleText && <h3 className="text-3xl font-light font-luxury-heading">{titleText}</h3>}
        </div>
      </div>
    </section>
  );
}



