export interface AppErrorOptions {
  code: string;
  message: string;
  status?: number;
  details?: unknown;
  cause?: unknown;
}

export class AppError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly details?: unknown;
  override readonly cause?: unknown;

  constructor({ code, message, status, details, cause }: AppErrorOptions) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.cause = cause;
  }
}

export class ApiError extends AppError {
  constructor(message: string, status: number, data?: unknown) {
    super({
      code: 'HTTP_ERROR',
      message,
      status,
      details: data,
    });
    this.name = 'ApiError';
  }

  get data(): unknown {
    return this.details;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError({
      code: 'UNKNOWN_ERROR',
      message: error.message,
      cause: error,
    });
  }

  return new AppError({
    code: 'UNKNOWN_ERROR',
    message: String(error),
    cause: error,
  });
}
