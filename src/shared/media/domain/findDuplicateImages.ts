import type { R2Image } from '@/shared/media/types';
import { calculateHashSimilarity } from './imageProcessing';

export interface DuplicateImageMatch {
  image: R2Image;
  similarity: number;
}

export function findDuplicateImages(
  hash: string | undefined,
  images: R2Image[],
  threshold = 0.95,
): DuplicateImageMatch[] {
  if (!hash) {
    return [];
  }

  return images
    .map((image) => ({
      image,
      similarity: image.hash ? calculateHashSimilarity(hash, image.hash) : 0,
    }))
    .filter((match) => match.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);
}
