export interface MediaConfig {
  assetsBaseUrl?: string;
  assetHostnames?: readonly string[];
}

declare global {
  interface Window {
    __SITE_MEDIA_CONFIG__?: MediaConfig;
  }
}

const defaultMediaConfig: MediaConfig = {
  assetsBaseUrl: import.meta.env.PUBLIC_API_ASSETS,
};

let activeMediaConfig: MediaConfig = defaultMediaConfig;

function getEffectiveMediaConfig(): MediaConfig {
  const browserConfig = typeof window === "undefined" ? {} : window.__SITE_MEDIA_CONFIG__ ?? {};
  return {
    ...defaultMediaConfig,
    ...browserConfig,
    ...activeMediaConfig,
  };
}

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
  activeMediaConfig = {
    ...defaultMediaConfig,
    ...config,
  };
}

export function resolveMediaUrl(url: string | null | undefined) {
  return createMediaResolver(getEffectiveMediaConfig()).resolveMediaUrl(url);
}

export function getOptimizedImageUrl(url: string | null | undefined, width: number) {
  return createMediaResolver(getEffectiveMediaConfig()).getOptimizedImageUrl(url, width);
}
