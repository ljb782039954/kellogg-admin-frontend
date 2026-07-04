import { ProductVideo, type ProductVideoSource } from "../base";

export interface VideoSectionProps {
  titleText?: string;
  subtitleText?: string;
  videoSource?: ProductVideoSource | null;
}

export default function VideoSection({ titleText = "", subtitleText = "", videoSource = null }: VideoSectionProps) {
  if (!videoSource) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          {(titleText || subtitleText) && (
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              {titleText && <h2 className="text-4xl font-bold text-gray-900 tracking-tight">{titleText}</h2>}
              {subtitleText && <p className="text-lg text-gray-500 font-light leading-relaxed">{subtitleText}</p>}
              <div className="w-12 h-1 bg-gray-900 mx-auto rounded-full mt-6" />
            </div>
          )}
          <div className="shadow-2xl rounded-[40px] overflow-hidden">
            <ProductVideo source={videoSource} />
          </div>
        </div>
      </div>
    </section>
  );
}
