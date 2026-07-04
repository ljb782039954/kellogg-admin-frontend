import type { SafeVideoSource } from "@/cms/lib/video";
import { cn } from "@/lib/utils";

export type EmbeddedVideoAspect = "auto" | "landscape" | "portrait" | "square";

export interface EmbeddedVideoProps {
  source?: SafeVideoSource | null;
  title?: string;
  aspect?: EmbeddedVideoAspect;
  className?: string;
}

function getAspectClass(source: SafeVideoSource, aspect: EmbeddedVideoAspect) {
  if (aspect === "portrait") return "aspect-[9/16] max-w-[420px] mx-auto";
  if (aspect === "square") return "aspect-square max-w-[720px] mx-auto";
  if (aspect === "landscape") return "aspect-video";
  return source.kind === "embed" && source.vertical ? "aspect-[9/16] max-w-[420px] mx-auto" : "aspect-video";
}

export default function EmbeddedVideo({
  source,
  title = "Embedded video",
  aspect = "auto",
  className,
}: EmbeddedVideoProps) {
  if (!source) return null;

  const aspectClassName = getAspectClass(source, aspect);

  if (source.kind === "video") {
    return (
      <div className={cn("relative overflow-hidden bg-black", aspectClassName, className)}>
        <video src={source.url} controls preload="metadata" className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-black", aspectClassName, className)}>
      <iframe
        src={source.url}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
