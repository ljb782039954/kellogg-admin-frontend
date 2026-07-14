import { Sparkles } from "lucide-react";
import type { Language, Translation } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface ImageBannerTagContent {
  image?: string;
  tag?: Translation;
  title?: Translation;
  subtitle?: Translation;
}
  export interface ImageBannerTagProps {
    content: ImageBannerTagContent
  lang: Language;
  getImageUrl?: (src: string, width: number) => string;
}

export default function ImageBannerTag({
  content:{
    image,
    tag,
    title,
    subtitle,
  },
  lang,
  getImageUrl,
}: ImageBannerTagProps) {
  const t = createTranslate(lang);
  const tagText = tag ? t(tag) : "";
  const titleText = title ? t(title) : "";
  const subtitleText = subtitle ? t(subtitle) : "";
  const imageUrl = image && getImageUrl ? getImageUrl(image, 1920) : (image || "");
  const escapedBgImage = imageUrl.replace(/"/g, '\\"');

  return (
    <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-gray-900">
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url("${escapedBgImage}")` }} />
      <div className="relative z-10 text-center px-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-amber-400 font-medium tracking-widest text-sm uppercase">{tagText}</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">{titleText}</h1>
        <p className="text-lg md:text-xl text-white max-w-2xl mx-auto font-light">{subtitleText}</p>
      </div>
    </section>
  );
}
