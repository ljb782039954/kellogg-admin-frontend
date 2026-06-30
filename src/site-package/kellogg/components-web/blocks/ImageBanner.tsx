import MotionHeaderDark from "../custom/motionHeaderDark";
import type { Translation } from "@/types";

export interface ImageBannerProps {
  image?: string;
  title?: Translation;
  subtitle?: Translation;
  buttonText?: Translation;
  linkUrl?: string;
  height?: 'small' | 'medium' | 'large' | 'full';
  overlay?: boolean;
}
interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: ImageBannerProps;
}

export default function ImageBanner({
  t,
  props,
}: Props) {
  const { title, subtitle, buttonText, image, height = 'medium', overlay = true } = props;
  const heightClasses = {
    small: 'h-48',
    medium: 'h-64',
    large: 'h-96'
  };

  return (
    <section className={`relative ${heightClasses[height]} overflow-hidden`}>
      <img
        src={image}
        alt={t(title)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {overlay && <div className="absolute inset-0 bg-black/40" />}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <MotionHeaderDark t={t} title={title} subtitle={subtitle} />
        {buttonText && (
          <button
            className="px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
            {t(buttonText)}
          </button>
        )}
      </div>
    </section>
  );
}
