import OptimizedImage from "@/runtime/components/OptimizedImage";

export interface ImageBannerProps {
  image?: string;
  imageAlt?: string;
  titleText?: string;
  subtitleText?: string;
  buttonText?: string;
  linkUrl?: string;
  height?: "small" | "medium" | "large" | "full";
  overlay?: boolean;
}

export default function ImageBanner({
  image,
  imageAlt = "Banner",
  titleText = "",
  subtitleText = "",
  buttonText = "",
  linkUrl,
  height = "medium",
  overlay = true,
}: ImageBannerProps) {
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
        {buttonText && <a href={linkUrl || "#"} className="px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">{buttonText}</a>}
      </div>
    </section>
  );
}
