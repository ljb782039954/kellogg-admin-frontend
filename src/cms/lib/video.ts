export type SafeVideoSource =
  | { kind: "embed"; provider: "youtube" | "vimeo" | "facebook" | "tiktok"; url: string; vertical?: boolean }
  | { kind: "video"; provider: "direct"; url: string };

export type SafeVideoProvider = SafeVideoSource["provider"];

export interface SafeVideoOptions {
  assetsBase?: string;
  providers?: readonly SafeVideoProvider[];
}

const VIDEO_ID = /^[a-zA-Z0-9_-]{6,32}$/;
const DEFAULT_PROVIDERS: SafeVideoProvider[] = ["youtube", "vimeo", "facebook", "tiktok", "direct"];

function normalizeHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function isHost(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

function normalizeOptions(options?: string | SafeVideoOptions): Required<SafeVideoOptions> {
  if (typeof options === "string") {
    return { assetsBase: options, providers: DEFAULT_PROVIDERS };
  }

  return {
    assetsBase: options?.assetsBase ?? "",
    providers: options?.providers ?? DEFAULT_PROVIDERS,
  };
}

function allowsProvider(provider: SafeVideoProvider, providers: readonly SafeVideoProvider[]) {
  return providers.includes(provider);
}

export function getSafeVideoSource(rawUrl: string, options?: string | SafeVideoOptions): SafeVideoSource | null {
  const { assetsBase, providers } = normalizeOptions(options);
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = normalizeHost(url.hostname);
  const pathParts = url.pathname.split("/").filter(Boolean);

  if (allowsProvider("youtube", providers) && (isHost(host, "youtube.com") || isHost(host, "youtube-nocookie.com") || host === "youtu.be")) {
    const videoId = host === "youtu.be"
      ? pathParts[0]
      : pathParts[0] === "shorts" || pathParts[0] === "embed"
        ? pathParts[1]
        : url.searchParams.get("v");
    if (!videoId || !VIDEO_ID.test(videoId)) return null;
    return {
      kind: "embed",
      provider: "youtube",
      url: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
      ...(pathParts[0] === "shorts" ? { vertical: true } : {}),
    };
  }

  if (allowsProvider("vimeo", providers) && isHost(host, "vimeo.com")) {
    const videoId = pathParts.find((part) => /^\d+$/.test(part));
    if (!videoId) return null;
    return { kind: "embed", provider: "vimeo", url: `https://player.vimeo.com/video/${videoId}` };
  }

  if (allowsProvider("tiktok", providers) && isHost(host, "tiktok.com")) {
    const videoIndex = pathParts.indexOf("video");
    const videoId = videoIndex >= 0 ? pathParts[videoIndex + 1] : undefined;
    if (!videoId || !/^\d+$/.test(videoId)) return null;
    return { kind: "embed", provider: "tiktok", url: `https://www.tiktok.com/embed/v2/${videoId}`, vertical: true };
  }

  if (allowsProvider("facebook", providers) && (isHost(host, "facebook.com") || host === "fb.watch")) {
    return {
      kind: "embed",
      provider: "facebook",
      url: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.toString())}&show_text=0`,
    };
  }

  if (allowsProvider("direct", providers) && assetsBase) {
    try {
      const assetsUrl = new URL(assetsBase);
      if (normalizeHost(assetsUrl.hostname) === host && /\.(mp4|webm|ogg)$/.test(url.pathname.toLowerCase())) {
        return { kind: "video", provider: "direct", url: url.toString() };
      }
    } catch {
      return null;
    }
  }

  return null;
}
