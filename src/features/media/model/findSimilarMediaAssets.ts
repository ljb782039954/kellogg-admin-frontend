import type { R2Image } from '@/types';
import { calculateHashSimilarity } from '@/lib/image';
import type { SimilarImage, SimilarMatchType } from './media.types';

export interface SimilarityPolicy {
  hashExactThreshold: number;
  hashHighThreshold: number;
  sizeDiffRatio: number;
}

const DEFAULT_POLICY: SimilarityPolicy = {
  hashExactThreshold: 1,
  hashHighThreshold: 0.85,
  sizeDiffRatio: 0.05,
};

const MATCH_ORDER: Record<SimilarMatchType, number> = {
  exact_hash: 0,
  high_similarity: 1,
  exact: 2,
  dimension: 3,
  size: 4,
  close_size: 5,
};

export function findSimilarMediaAssets(
  selected: R2Image,
  images: R2Image[],
  policy: SimilarityPolicy = DEFAULT_POLICY,
): SimilarImage[] {
  const results: SimilarImage[] = [];

  for (const img of images) {
    if (img.key === selected.key) continue;

    if (selected.hash && img.hash) {
      const similarity = calculateHashSimilarity(selected.hash, img.hash);
      if (similarity >= policy.hashExactThreshold) {
        results.push({
          image: img,
          matchType: 'exact_hash',
          similarity,
          reasonCode: 'VISUAL_IDENTICAL',
        });
        continue;
      }
      if (similarity >= policy.hashHighThreshold) {
        results.push({
          image: img,
          matchType: 'high_similarity',
          similarity,
          reasonCode: 'VISUAL_HIGH_SIMILARITY',
        });
        continue;
      }
    }

    const hasDimensions = !!(selected.dimensions && img.dimensions);
    const sameDimensions = hasDimensions && selected.dimensions === img.dimensions;
    const sameSize = selected.size === img.size;
    const sizeDiff = selected.size ? Math.abs(selected.size - img.size) / selected.size : 1;
    const closeSize = sizeDiff < policy.sizeDiffRatio;

    if (sameDimensions && sameSize) {
      results.push({ image: img, matchType: 'exact', similarity: 1, reasonCode: 'SAME_DIMENSIONS_SIZE' });
    } else if (sameDimensions) {
      results.push({ image: img, matchType: 'dimension', similarity: 0.8, reasonCode: 'SAME_DIMENSIONS' });
    } else if (sameSize) {
      results.push({ image: img, matchType: 'size', similarity: 0.6, reasonCode: 'SAME_SIZE' });
    } else if (closeSize) {
      results.push({ image: img, matchType: 'close_size', similarity: 0.4, reasonCode: 'CLOSE_SIZE' });
    }
  }

  return results.sort(
    (a, b) => MATCH_ORDER[a.matchType] - MATCH_ORDER[b.matchType] || b.similarity - a.similarity,
  );
}

export function similarMatchLabel(reasonCode: string, similarity?: number): string {
  switch (reasonCode) {
    case 'VISUAL_IDENTICAL': return '视觉内容完全相同 (100%)';
    case 'VISUAL_HIGH_SIMILARITY': return `视觉相似度: ${((similarity ?? 0) * 100).toFixed(0)}%`;
    case 'SAME_DIMENSIONS_SIZE': return '尺寸与大小完全相同';
    case 'SAME_DIMENSIONS': return '原始尺寸相同';
    case 'SAME_SIZE': return '文件大小相同';
    case 'CLOSE_SIZE': return '大小相近';
    default: return '';
  }
}
