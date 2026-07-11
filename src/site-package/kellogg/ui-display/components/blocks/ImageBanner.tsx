import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface ImageBannerContent {
  image?: string;
  title?: Translation;
  subtitle?: Translation;
  buttonText?: Translation;
  linkUrl?: string;
  height?: "small" | "medium" | "large" | "full";
  overlay?: boolean;
}

export interface ImageBannerProps {
  content: ImageBannerContent;
  lang: Language;
}


export default function ImageBanner({
  content: {
    image,
    title,
    subtitle,
    buttonText,
    linkUrl,
    height = "medium",
    overlay = true,
  },
  lang,
}: ImageBannerProps) {
  const t = createTranslate(lang);
  const titleText = title ? t(title) : "";
  const subtitleText = subtitle ? t(subtitle) : "";
  const buttonTextText = buttonText ? t(buttonText) : "";
  const imageAlt = titleText || "Banner";

  const heightClass = {
    small: "h-48 md:h-64",
    medium: "h-64 md:h-[400px]",
    large: "h-96 md:h-[600px]",
    full: "h-screen",
  }[height];

  return (
    <section className={`relative overflow-hidden ${heightClass}`}>
      <OptimizedImage src={image} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover object-center" sizes="100vw" />
      {overlay && <div className="absolute inset-0 bg-black/40" />}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4 text-center">
        {(titleText || subtitleText) && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            {titleText && <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">{titleText}</h2>}
            {subtitleText && <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/70">{subtitleText}</p>}
          </div>
        )}
        {buttonTextText && <a href={linkUrl || "#"} className="px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">{buttonTextText}</a>}
      </div>
    </section>
  );
}
