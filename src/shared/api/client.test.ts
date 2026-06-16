import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/mocks/server';
import { createApiClient } from './client';
import { ApiError, AppError } from './errors';

const baseUrl = 'https://admin-api.test';

describe('createApiClient', () => {
  it('adds the admin token and parses JSON responses', async () => {
    server.use(
      http.get(`${baseUrl}/api/health`, ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer secret-token');
        expect(request.headers.get('Content-Type')).toBe('application/json');
        return HttpResponse.json({ ok: true });
      }),
    );

    const client = createApiClient({ baseUrl, token: 'secret-token' });

    await expect(client.request<{ ok: boolean }>('/api/health')).resolves.toEqual({ ok: true });
  });

  it('converts non-success responses to ApiError', async () => {
    server.use(
      http.get(`${baseUrl}/api/missing`, () =>
        HttpResponse.json({ error: 'Missing resource' }, { status: 404 }),
      ),
    );

    const client = createApiClient({ baseUrl });
    const error = await client.request('/api/missing').catch((cause) => cause);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      name: 'ApiError',
      code: 'HTTP_ERROR',
      message: 'Missing resource',
      status: 404,
    });
  });

  it('preserves raw error bodies when non-success responses are not JSON', async () => {
    server.use(
      http.get(
        `${baseUrl}/api/html-error`,
        () => new HttpResponse('<h1>Bad gateway</h1>', {
          status: 502,
          statusText: 'Bad Gateway',
          headers: { 'Content-Type': 'text/html' },
        }),
      ),
    );

    const client = createApiClient({ baseUrl });
    const error = await client.request('/api/html-error').catch((cause) => cause);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      message: 'Bad Gateway',
      status: 502,
      details: { raw: '<h1>Bad gateway</h1>' },
    });
  });

  it('reports invalid successful JSON responses', async () => {
    server.use(
      http.get(
        `${baseUrl}/api/invalid-json`,
        () => new HttpResponse('not-json', { status: 200 }),
      ),
    );

    const client = createApiClient({ baseUrl });
    const error = await client.request('/api/invalid-json').catch((cause) => cause);

    expect(error).toBeInstanceOf(AppError);
    expect(error).toMatchObject({
      code: 'INVALID_RESPONSE',
    });
  });

  it('does not force a JSON content type for FormData', async () => {
    server.use(
      http.post(`${baseUrl}/api/upload`, ({ request }) => {
        expect(request.headers.get('Content-Type')).toContain('multipart/form-data');
        return HttpResponse.json({ url: '/uploaded/image.jpg' });
      }),
    );

    const formData = new FormData();
    formData.append('file', new File(['image'], 'image.jpg', { type: 'image/jpeg' }));
    const client = createApiClient({ baseUrl });

    await expect(
      client.request<{ url: string }>('/api/upload', {
        method: 'POST',
        body: formData,
      }),
    ).resolves.toEqual({ url: '/uploaded/image.jpg' });
  });

  it('does not overwrite explicit authorization or content type headers', async () => {
    server.use(
      http.post(`${baseUrl}/api/custom`, async ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer override-token');
        expect(request.headers.get('Content-Type')).toBe('application/merge-patch+json');
        return HttpResponse.json({ ok: true });
      }),
    );

    const client = createApiClient({ baseUrl, token: 'default-token' });

    await expect(
      client.request('/api/custom', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer override-token',
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify({ active: true }),
      }),
    ).resolves.toEqual({ ok: true });
  });
});
