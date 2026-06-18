import type { R2Image } from '@/types';
import type { UsageInfo } from './media.types';

export function indexMediaUsages(images: R2Image[]): Record<string, UsageInfo[]> {
  const map: Record<string, UsageInfo[]> = {};
  for (const img of images) {
    if (img.usages && img.usages.length > 0) {
      map[img.key] = img.usages.map((u) => ({
        type: u.type,
        name: u.name,
        id: u.id,
      }));
    }
  }
  return map;
}
