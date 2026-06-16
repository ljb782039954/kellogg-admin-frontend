import { adminToken, apiBaseUrl } from './config';
import { ApiError, AppError } from './errors';

interface ApiClientOptions {
  baseUrl: string;
  token?: string;
  fetcher?: typeof fetch;
}

function joinUrl(baseUrl: string, path: string): string {
  if (!baseUrl) {
    return path;
  }

  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function isFormData(body: BodyInit | null | undefined): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

function readErrorMessage(data: unknown, fallback: string): string {
  if (typeof data !== 'object' || data === null) {
    return fallback;
  }

  const payload = data as Record<string, unknown>;
  if (typeof payload.error === 'string') {
    return payload.error;
  }
  if (typeof payload.message === 'string') {
    return payload.message;
  }
  return fallback;
}

export function createApiClient({
  baseUrl,
  token,
  fetcher = fetch,
}: ApiClientOptions) {
  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);

    if (!isFormData(options.body) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response: Response;
    try {
      response = await fetcher(joinUrl(baseUrl, path), {
        ...options,
        headers,
      });
    } catch (cause) {
      throw new AppError({
        code: 'NETWORK_ERROR',
        message: '无法连接到服务器',
        cause,
      });
    }

    const text = await response.text();
    let data: unknown = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch (cause) {
        if (response.ok) {
          throw new AppError({
            code: 'INVALID_RESPONSE',
            message: '服务器返回了无法解析的数据',
            status: response.status,
            details: text,
            cause,
          });
        } else {
          data = { raw: text };
        }
      }
    }

    if (!response.ok) {
      throw new ApiError(
        readErrorMessage(data, response.statusText || 'Request failed'),
        response.status,
        data,
      );
    }

    return data as T;
  }

  return { request };
}

export const apiClient = createApiClient({
  baseUrl: apiBaseUrl,
  token: adminToken,
});
