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
});
