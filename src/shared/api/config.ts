const isLocalDev = import.meta.env.VITE_IS_LOCAL_DEV === 'true';

export const apiBaseUrl = isLocalDev
  ? (import.meta.env.VITE_API_BASE_URL_LOCAL ?? '')
  : (import.meta.env.VITE_API_BASE_URL ?? '');

export const adminToken = isLocalDev
  ? import.meta.env.VITE_ADMIN_TOKEN_LOCAL
  : import.meta.env.VITE_ADMIN_TOKEN;
