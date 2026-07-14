import type { CSSProperties } from "react";
import type { Language, Translation, NavLink } from "@/cms/types";
import { createTranslate } from "../../utils/i18n";

// 实际的内容编辑栏
export interface CtaBannerValues {
  primaryButton?: NavLink;
  secondaryButton?: NavLink;
  backgroundImage?: string;
  backgroundColor?: string;
  alignment?: "left" | "center" | "right";
}

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface CtaBannerContent {
  title?: Translation;
  subtitle?: Translation;
  values?: CtaBannerValues;
}

export interface CtaBannerProps {
  content: CtaBannerContent;
  lang: Language;
  getImageUrl?: (src: string, width: number) => string;
}

const alignmentClass = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
};

export default function CtaBanner({
  content,
  getImageUrl,
  lang,
}: CtaBannerProps) {
  const translate = createTranslate(lang);
  const titleText = content.title ? translate(content.title) : "";
  const subtitleText = content.subtitle ? translate(content.subtitle) : "";

  const values = content.values ?? {};
  const alignment = values.alignment || "center";
  const backgroundColor = values.backgroundColor;
  const backgroundImageUrl = values.backgroundImage && getImageUrl
    ? getImageUrl(values.backgroundImage, 1920)
    : (values.backgroundImage || "");

  const primaryButton = values.primaryButton?.name
    ? {
        href: values.primaryButton.href,
        label: translate(values.primaryButton.name),
      }
    : undefined;

  const secondaryButton = values.secondaryButton?.name
    ? {
        href: values.secondaryButton.href,
        label: translate(values.secondaryButton.name),
      }
    : undefined;
  const backgroundStyle: CSSProperties | undefined = backgroundColor ? { backgroundColor } : undefined;

  return (
    <div className="relative rounded-2xl overflow-hidden text-white my-8 mx-4">
      {backgroundImageUrl ? (
        <>
          <img src={backgroundImageUrl} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-700" style={backgroundStyle} />
      )}
      <div className={`relative container mx-auto px-6 py-16 flex flex-col ${alignmentClass[alignment]}`}>
        {titleText && <h2 className="text-3xl md:text-5xl font-bold mb-3">{titleText}</h2>}
        {subtitleText && <p className="text-base md:text-lg text-white/80 max-w-2xl">{subtitleText}</p>}
        <div className="flex flex-wrap gap-4 mt-6">
          {primaryButton && (
            <a href={primaryButton.href} className="px-8 py-3 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">
              {primaryButton.label}
            </a>
          )}
          {secondaryButton && (
            <a href={secondaryButton.href} className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg font-bold hover:bg-white/30 transition-colors">
              {secondaryButton.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
