import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPreviewUrl(url: string | undefined, isThumbnail: boolean = false): string {
  if (!url) return '';

  // Respect the VITE_IS_LOCAL_DEV env var to control local dev mode
  const isLocalDev = import.meta.env.VITE_IS_LOCAL_DEV === "true";

  let targetUrl = url;

  // Rewrite uploads/ to thumbnails/ if thumbnail is requested and the URL points to an image
  const isImageFile = /\.(png|jpg|jpeg|webp|gif|svg)(\?.*)?$/i.test(targetUrl);
  if (isThumbnail && isImageFile && targetUrl.includes('uploads/')) {
    targetUrl = targetUrl.replace('uploads/', 'thumbnails/');
  }

  // Resolve relative paths like 'uploads/xxx', 'thumbnails/xxx' or their slashed forms
  if (targetUrl.startsWith('uploads/')) {
    targetUrl = '/' + targetUrl;
  } else if (targetUrl.startsWith('thumbnails/')) {
    targetUrl = '/' + targetUrl;
  }
  
  if (targetUrl.startsWith('/uploads/') || targetUrl.startsWith('/thumbnails/')) {
    const apiBase = isLocalDev 
      ? (import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:8787')
      : (import.meta.env.VITE_API_ASSETS || import.meta.env.VITE_API_BASE_URL || '');
    targetUrl = `${apiBase}${targetUrl}`;
  }

  // Rewrite live URLs to local worker address to preview locally uploaded R2 files
  if (isLocalDev) {
    const assetsBase = import.meta.env.VITE_API_ASSETS || 'https://assets.kelloggfashion.com';
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://kellogg-api.aimeexiang239.workers.dev';
    const localBase = import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:8787';

    if (targetUrl.includes(assetsBase)) {
      targetUrl = targetUrl.replace(assetsBase, localBase);
    } else if (targetUrl.includes(apiBase)) {
      targetUrl = targetUrl.replace(apiBase, localBase);
    }
  }

  return targetUrl;
}
