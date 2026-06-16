import { describe, expect, it } from 'vitest';
import { ApiError, AppError, isAppError, toAppError } from './errors';

describe('AppError', () => {
  it('stores stable application error metadata', () => {
    const cause = new Error('socket closed');
    const error = new AppError({
      code: 'NETWORK_ERROR',
      message: '无法连接服务器',
      status: 503,
      details: { retryable: true },
      cause,
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AppError');
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.status).toBe(503);
    expect(error.details).toEqual({ retryable: true });
    expect(error.cause).toBe(cause);
    expect(isAppError(error)).toBe(true);
  });

  it('keeps the legacy ApiError constructor contract', () => {
    const error = new ApiError('Not found', 404, { resource: 'page' });

    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe('ApiError');
    expect(error.code).toBe('HTTP_ERROR');
    expect(error.status).toBe(404);
    expect(error.data).toEqual({ resource: 'page' });
  });

  it('normalizes unknown thrown values', () => {
    const normalized = toAppError('offline');

    expect(normalized).toBeInstanceOf(AppError);
    expect(normalized.code).toBe('UNKNOWN_ERROR');
    expect(normalized.message).toBe('offline');
  });
});
