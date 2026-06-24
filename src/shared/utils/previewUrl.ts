export function getPreviewUrl(
  url: string | undefined,
  isThumbnail = false,
): string {
  if (!url) return '';

  const isLocalDev = import.meta.env.VITE_IS_LOCAL_DEV === 'true';
  let targetUrl = url;

  const isImageFile = /\.(png|jpg|jpeg|webp|gif|svg)(\?.*)?$/i.test(targetUrl);
  if (isThumbnail && isImageFile && targetUrl.includes('uploads/')) {
    targetUrl = targetUrl.replace('uploads/', 'thumbnails/');
  }

  if (targetUrl.startsWith('uploads/')) {
    targetUrl = `/${targetUrl}`;
  } else if (targetUrl.startsWith('thumbnails/')) {
    targetUrl = `/${targetUrl}`;
  }

  if (targetUrl.startsWith('/uploads/') || targetUrl.startsWith('/thumbnails/')) {
    const apiBase = isLocalDev
      ? import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:8787'
      : import.meta.env.VITE_API_ASSETS || import.meta.env.VITE_API_BASE_URL || '';
    targetUrl = `${apiBase}${targetUrl}`;
  }

  if (isLocalDev) {
    const assetsBase =
      import.meta.env.VITE_API_ASSETS || 'https://assets.kelloggfashion.com';
    const apiBase =
      import.meta.env.VITE_API_BASE_URL ||
      'https://kellogg-api.aimeexiang239.workers.dev';
    const localBase =
      import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:8787';

    if (targetUrl.includes(assetsBase)) {
      targetUrl = targetUrl.replace(assetsBase, localBase);
    } else if (targetUrl.includes(apiBase)) {
      targetUrl = targetUrl.replace(apiBase, localBase);
    }
  }

  return targetUrl;
}
