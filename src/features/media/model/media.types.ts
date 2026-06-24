import type { R2Image } from '@/shared/media/types';

export interface UsageInfo {
  type: string;
  name: string;
  id?: string;
}

export type SimilarMatchType =
  | 'exact_hash'
  | 'high_similarity'
  | 'exact'
  | 'dimension'
  | 'size'
  | 'close_size';

export interface SimilarImage {
  image: R2Image;
  matchType: SimilarMatchType;
  similarity: number;
  reasonCode: string;
}

export interface DeleteRisk {
  key: string;
  imageName: string;
  usageCount: number;
  hasUsages: boolean;
}
