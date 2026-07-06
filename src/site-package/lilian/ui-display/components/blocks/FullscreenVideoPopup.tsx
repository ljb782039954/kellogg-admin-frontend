import EmbeddedVideo, { type EmbeddedVideoAspect } from "@/runtime/components/EmbeddedVideo";
import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { SafeVideoSource } from "@/cms/lib/video";
import { Play } from "lucide-react";
import { useState } from "react";

export interface FullscreenVideoPopupProps {
  source?: SafeVideoSource | null;
  title?: string;
  coverImage: string;
  coverImageAlt?: string;
  aspect?: EmbeddedVideoAspect;
  caption?: string;
}

export default function FullscreenVideoPopup({
  source,
  title = "Video",
  coverImage,
  coverImageAlt = "",
  aspect = "auto",
  caption = "",
}: FullscreenVideoPopupProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  if (!source) return null;
  const coverAspectClass = aspect === "portrait"
    ? "aspect-[9/16] max-w-[420px] mx-auto"
    : aspect === "square"
      ? "aspect-square max-w-[720px] mx-auto"
      : "aspect-video";

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-center">
      {isPlaying ? (
        <EmbeddedVideo source={source} title={title} aspect={aspect} className="rounded-md shadow-2xl" />
      ) : (
        <button
          type="button"
          className={`relative block w-full overflow-hidden rounded-md bg-soft ${coverAspectClass}`}
          onClick={() => setIsPlaying(true)}
          aria-label={title}
        >
          <OptimizedImage src={coverImage} alt={coverImageAlt || caption} className="w-full h-full object-cover" sizes="900px" />
          <div className="absolute inset-0 flex items-center justify-center bg-overlay-soft hover:bg-overlay-soft transition-colors">
            <div className="w-16 h-16 bg-surface-glass rounded-full flex items-center justify-center text-ink shadow-sm">
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            </div>
          </div>
        </button>
      )}
      {caption && <p className="text-xs text-subtle mt-3">{caption}</p>}
    </section>
  );
}



