export interface ProductVideoSource {
  kind: "embed" | "video";
  url: string;
  vertical?: boolean;
  title?: string;
}

interface ProductVideoProps {
  source?: ProductVideoSource | null;
}

export default function ProductVideo({ source }: ProductVideoProps) {
  if (!source) return null;

  if (source.kind === "embed") {
    return (
      <div className={`relative rounded-[32px] overflow-hidden bg-black shadow-2xl border border-gray-100 ${source.vertical ? "aspect-[9/16] max-w-[420px] mx-auto" : "aspect-video"}`}>
        <iframe
          src={source.url}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={source.title || "Product Video"}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl">
      <video src={source.url} controls preload="metadata" className="w-full h-full object-contain" />
    </div>
  );
}
