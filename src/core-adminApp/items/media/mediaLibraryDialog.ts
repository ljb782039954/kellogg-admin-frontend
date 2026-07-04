import type { R2Image } from '@/cms/types';

export function filterMediaLibraryImages(images: R2Image[], searchQuery: string): R2Image[] {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return images;

  return images.filter((image) => image.name.toLowerCase().includes(query));
}

export function findMediaLibraryImage(images: R2Image[], selectedKey: string | null): R2Image | undefined {
  if (!selectedKey) return undefined;

  return images.find((image) => image.key === selectedKey);
}

export function formatMediaFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const unit = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(unit));

  return `${parseFloat((bytes / Math.pow(unit, unitIndex)).toFixed(2))} ${sizes[unitIndex]}`;
}
