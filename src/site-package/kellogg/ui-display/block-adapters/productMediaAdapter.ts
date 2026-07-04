import { getSafeVideoSource, type SafeVideoProvider } from "@/cms/lib/video";
import type { ProductVideoSource } from "../components/base";

const KELLOGG_VIDEO_PROVIDERS = [
  "youtube",
  "vimeo",
  "facebook",
  "tiktok",
  "direct",
] satisfies readonly SafeVideoProvider[];

export function toProductVideoSource(url?: string, poster?: string): ProductVideoSource | null {
  if (!url) return null;

  const source = getSafeVideoSource(url, {
    assetsBase: import.meta.env.PUBLIC_API_ASSETS,
    providers: KELLOGG_VIDEO_PROVIDERS,
  });

  return source
    ? {
        kind: source.kind,
        url: source.url,
        poster,
        vertical: source.kind === "embed" ? source.vertical : undefined,
        title: "Product Video",
      }
    : null;
}

export function toProductVideoSources(urls: string[] = []): ProductVideoSource[] {
  return urls
    .map((url) => toProductVideoSource(url))
    .filter((source): source is ProductVideoSource => Boolean(source));
}
