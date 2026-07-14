import { getSafeVideoSource, type SafeVideoProvider } from "@/cms/lib/video";
import { cn } from "@/lib/utils";

const EMBED_VIDEO_PROVIDERS: SafeVideoProvider[] = ["youtube", "vimeo", "facebook", "tiktok"];

export interface VideoEmbedProps {
  url?: string;
  title?: string;
  className?: string;
}

export function getVideoEmbedSource(url?: string) {
  if (!url) return null;

  const source = getSafeVideoSource(url, {
    providers: EMBED_VIDEO_PROVIDERS,
  });

  return source?.kind === "embed" ? source : null;
}

export default function VideoEmbed({
  url,
  title = "Embedded video",
  className,
}: VideoEmbedProps) {
  const source = getVideoEmbedSource(url);

  if (!source) return null;

  return (
    <iframe
      src={source.url}
      className={cn("w-full border-0", source.vertical ? "aspect-[9/16]" : "aspect-video", className)}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      title={title}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
