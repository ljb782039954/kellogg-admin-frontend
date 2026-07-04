import { createMediaResolver } from "./media";

export interface ApiClientConfig {
  baseUrl?: string;
  localBaseUrl?: string;
  useLocalBaseUrl?: boolean;
  assetsBaseUrl?: string;
  assetHostnames?: readonly string[];
}

// API 错误类型
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function normalizeApiBase(config: ApiClientConfig): string {
  const baseUrl = (config.useLocalBaseUrl ? config.localBaseUrl : config.baseUrl) || "";
  return baseUrl.replace(/\/$/, "");
}

export function createApiRequester(config: ApiClientConfig) {
  const apiBase = normalizeApiBase(config);
  const media = createMediaResolver(config);

  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${apiBase}${path}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const timeoutSignal = AbortSignal.timeout(10000);
    const signal = options.signal
      ? AbortSignal.any([options.signal, timeoutSignal])
      : timeoutSignal;
    const response = await fetch(url, {
      ...options,
      headers,
      signal,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        errorData.error || errorData.message || 'Request failed',
        response.status,
        errorData
      );
    }

    const text = await response.text();
    if (!text) return {} as T;

    return JSON.parse(text);
  }

  return {
    request,
    resolveMediaUrl: (url: string | null | undefined): string => {
      return media.resolveMediaUrl(url);
    },
    getOptimizedImageUrl: (url: string | null | undefined, width: number): string => {
      return media.getOptimizedImageUrl(url, width);
    },
  };
}

export type ApiRequester = ReturnType<typeof createApiRequester>;
