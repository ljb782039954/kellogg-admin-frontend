import VideoEmbed, { getVideoEmbedSource } from "@/runtime/components/VideoEmbed";
import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language } from "@/cms/types";
import { Play, X } from "lucide-react";
import { useState } from "react";
import type { LilianExternalVideoItem } from "../../types/common";
import { createTranslate } from "../../utils/i18n";

interface ActiveVideo {
  url: string;
  title: string;
}

// WARNING: This type represents the fields edited in the admin management background.
// Do not modify it lightly; any change requires manual verification.
// Arbitrary alterations may cause page builder block data errors and prevent normal page assembly.
export interface VideoGridContent {
  items: LilianExternalVideoItem[];
}

export interface VideoGridProps {
  content: VideoGridContent;
  lang: Language;
}

export default function VideoGrid({ content, lang = "en"}: VideoGridProps) {
  const t = createTranslate(lang);
  const resolvedItems = (Array.isArray(content?.items) ? content.items : [])
    .map((item) => ({
        title: t(item.title),
        description: t(item.description),
        coverImage: item.coverImage,
        coverImageAlt: t(item.coverImageAlt),
        url: item.url,
        canEmbed: Boolean(getVideoEmbedSource(item.url)),
      }))
    .filter((item) => item.canEmbed);
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
        {resolvedItems.map((item, index) => (
          <button
            key={`${item.url}-${index}`}
            type="button"
            className="w-full text-left group"
            onClick={() => setActiveVideo({ url: item.url, title: item.title || "Video" })}
            aria-label={item.title || "Play video"}
          >
            <div className="relative overflow-hidden rounded-md bg-soft aspect-video">
              <OptimizedImage
                src={item.coverImage}
                alt={item.coverImageAlt || item.title || ""}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-overlay-soft group-hover:bg-overlay-medium transition-colors">
                <span className="w-12 h-12 rounded-full bg-surface-glass text-ink flex items-center justify-center shadow-sm">
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                </span>
              </div>
            </div>
            {item.title && <p className="text-xs mt-2 text-ink">{item.title}</p>}
            {item.description && <p className="text-[11px] mt-1 text-subtle line-clamp-2">{item.description}</p>}
          </button>
        ))}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-overlay-strong flex items-center justify-center px-4 py-8" onClick={() => setActiveVideo(null)}>
          <button
            type="button"
            className="absolute top-4 right-4 w-10 h-10 rounded-full border border-on-dark-border text-on-dark flex items-center justify-center hover:bg-on-dark-wash"
            onClick={() => setActiveVideo(null)}
            aria-label="Close video"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <VideoEmbed
              url={activeVideo.url}
              title={activeVideo.title}
              className="rounded-md shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}

