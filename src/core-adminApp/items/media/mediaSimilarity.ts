import type { R2Image } from '@/cms/types';
import { calculateHashSimilarity } from '@/core-adminApp/lib/image';

export type MediaSimilarityMatchType =
  | 'exact_hash'
  | 'high_similarity'
  | 'exact'
  | 'dimension'
  | 'size'
  | 'close_size';

export interface SimilarMediaImage {
  image: R2Image;
  matchType: MediaSimilarityMatchType;
  reason: string;
}

const SIMILARITY_ORDER: Record<MediaSimilarityMatchType, number> = {
  exact_hash: 0,
  high_similarity: 1,
  exact: 2,
  dimension: 3,
  size: 4,
  close_size: 5,
};

export function findSimilarMediaImages(
  selectedImage: R2Image | undefined,
  images: R2Image[]
): SimilarMediaImage[] {
  if (!selectedImage) return [];

  const list: SimilarMediaImage[] = [];

  images.forEach(image => {
    if (image.key === selectedImage.key) return;

    if (selectedImage.hash && image.hash) {
      const similarity = calculateHashSimilarity(selectedImage.hash, image.hash);

      if (similarity === 1) {
        list.push({
          image,
          matchType: 'exact_hash',
          reason: '视觉内容完全相同 (100%)',
        });
        return;
      }

      if (similarity >= 0.85) {
        list.push({
          image,
          matchType: 'high_similarity',
          reason: `视觉相似度: ${(similarity * 100).toFixed(0)}%`,
        });
        return;
      }
    }

    const hasDimensions = !!(selectedImage.dimensions && image.dimensions);
    const sameDimensions = hasDimensions && selectedImage.dimensions === image.dimensions;
    const sameSize = selectedImage.size === image.size;
    const sizeDiff = Math.abs(selectedImage.size - image.size) / selectedImage.size;
    const closeSize = sizeDiff < 0.05;

    if (sameDimensions && sameSize) {
      list.push({
        image,
        matchType: 'exact',
        reason: '尺寸与大小完全相同',
      });
    } else if (sameDimensions) {
      list.push({
        image,
        matchType: 'dimension',
        reason: '原始尺寸相同',
      });
    } else if (sameSize) {
      list.push({
        image,
        matchType: 'size',
        reason: '文件大小相同',
      });
    } else if (closeSize) {
      list.push({
        image,
        matchType: 'close_size',
        reason: `大小相近 (差异 ${(sizeDiff * 100).toFixed(1)}%)`,
      });
    }
  });

  return list.sort((a, b) => SIMILARITY_ORDER[a.matchType] - SIMILARITY_ORDER[b.matchType]);
}
