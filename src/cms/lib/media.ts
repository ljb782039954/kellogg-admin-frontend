export interface MediaConfig {
  assetsBaseUrl?: string;
  assetHostnames?: readonly string[];
}

let activeMediaConfig: MediaConfig = {};

function normalizeHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function resolveConfiguredHostnames(config: MediaConfig): string[] {
  const hostnames = [...(config.assetHostnames ?? [])];

  if (config.assetsBaseUrl) {
    try {
      hostnames.push(new URL(config.assetsBaseUrl).hostname);
    } catch {}
  }

  return hostnames.map(normalizeHost).filter(Boolean);
}

function isConfiguredAssetUrl(url: string, hostnames: readonly string[]): boolean {
  if (!hostnames.length) return false;

  try {
    const host = normalizeHost(new URL(url).hostname);
    return hostnames.some((configuredHost) => (
      host === configuredHost || host.endsWith(`.${configuredHost}`)
    ));
  } catch {
    return false;
  }
}

export function createMediaResolver(config: MediaConfig) {
  const assetsBase = (config.assetsBaseUrl || "").replace(/\/$/, "");
  const assetHostnames = resolveConfiguredHostnames(config);

  const resolveMediaUrl = (url: string | null | undefined): string => {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("http")) return url;

    const cleanPath = url.startsWith("/") ? url.slice(1) : url;
    return assetsBase ? `${assetsBase}/${cleanPath}` : `/${cleanPath}`;
  };

  const getOptimizedImageUrl = (url: string | null | undefined, width: number): string => {
    if (!url) return "/placeholder.jpg";

    if (url.startsWith("http") && !isConfiguredAssetUrl(url, assetHostnames)) {
      return url;
    }

    const cleanUrl = url.split("?")[0];
    let path = cleanUrl;
    if (cleanUrl.startsWith("http")) {
      try {
        path = new URL(cleanUrl).pathname;
      } catch {}
    }

    const filename = path
      .replace(/^\//, "")
      .replace(/^uploads\//, "");

    if (!filename) return resolveMediaUrl(url);

    const quality = width <= 768 ? 75 : 85;
    if (!assetsBase) return resolveMediaUrl(url);

    return `${assetsBase}/cdn-cgi/image/width=${width},quality=${quality},format=auto/uploads/${filename}`;
  };

  return {
    resolveMediaUrl,
    getOptimizedImageUrl,
  };
}

export function configureMedia(config: MediaConfig) {
  activeMediaConfig = config;
}

export function resolveMediaUrl(url: string | null | undefined) {
  return createMediaResolver(activeMediaConfig).resolveMediaUrl(url);
}

export function getOptimizedImageUrl(url: string | null | undefined, width: number) {
  return createMediaResolver(activeMediaConfig).getOptimizedImageUrl(url, width);
}
