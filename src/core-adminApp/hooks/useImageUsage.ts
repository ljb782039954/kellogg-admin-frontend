import { useMemo } from 'react';
import { type R2Image } from '../types';

export interface UsageInfo {
  type: string;
  name: string;
  id?: string;
}

/**
 * Reconstructs usageMap from image assets returned by back-end
 */
export function useImageUsage(images: R2Image[] = []) {
  const usageMap = useMemo(() => {
    const map: Record<string, UsageInfo[]> = {};
    images.forEach(img => {
      map[img.key] = img.usages || [];
    });
    return map;
  }, [images]);

  return usageMap;
}
