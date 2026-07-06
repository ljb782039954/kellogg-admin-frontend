import OptimizedImage from "@/runtime/components/OptimizedImage";
import RichText from "@/runtime/components/RichText";

export interface ImageTextSplitProps {
  eyebrow?: string;
  titleText?: string;
  contentText?: string;
  image: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
}

export default function ImageTextSplit({
  eyebrow = "",
  titleText = "",
  contentText = "",
  image,
  imageAlt = "",
  imagePosition = "right",
}: ImageTextSplitProps) {
  const imageFirst = imagePosition === "left";

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className={imageFirst ? "md:order-2" : ""}>
          {eyebrow && <span className="text-[10px] tracking-[0.2em] text-subtle uppercase">{eyebrow}</span>}
          {titleText && <h3 className="text-xl font-light mt-2 mb-4 font-luxury-heading">{titleText}</h3>}
          {contentText && <RichText value={contentText} className="text-sm text-body leading-relaxed" />}
        </div>
        <div className={`overflow-hidden rounded-sm aspect-[4/5] ${imageFirst ? "md:order-1" : ""}`}>
          <OptimizedImage
            src={image}
            alt={imageAlt || titleText}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 560px"
          />
        </div>
      </div>
    </section>
  );
}



