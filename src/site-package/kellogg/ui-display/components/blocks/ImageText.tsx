import OptimizedImage from "@/runtime/components/OptimizedImage";
import RichText from "@/runtime/components/RichText";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface ImageTextContent {
  title?: Translation;
  content?: Translation;
  image?: string;
  imagePosition?: "left" | "right";
  buttonText?: Translation;
  buttonLink?: string;
}
export interface ImageTextProps {
  content:ImageTextContent;
  lang: Language;
}

export default function ImageText({
  content:{
    title,
    content,
    image,
    imagePosition = "left",
    buttonText,
    buttonLink,
  },
  lang,
}: ImageTextProps) {
  const t = createTranslate(lang);
  const titleText = title ? t(title) : "";
  const contentText = content ? t(content) : "";
  const buttonTextText = buttonText ? t(buttonText) : "";
  const imageAlt = titleText || "Section Image";
  const isInternal = buttonLink?.startsWith("/");

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] items-center gap-8 md:gap-12 px-4 ${imagePosition === "right" ? "md:[&>*:first-child]:order-2" : ""}`}>
          <div className="flex-1 w-full">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <OptimizedImage src={image} alt={imageAlt} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            {titleText && <h3 className="text-2xl md:text-4xl font-bold">{titleText}</h3>}
            {contentText && <RichText value={contentText} className="text-gray-600 text-md md:text-lg leading-relaxed content-rich-text" />}
            {buttonTextText && buttonLink && (
              <a href={buttonLink} target={isInternal ? undefined : "_blank"} rel={isInternal ? undefined : "noopener noreferrer"} className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                {buttonTextText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
