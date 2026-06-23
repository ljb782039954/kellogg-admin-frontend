import type { EntityAdapter } from '@/core/contracts';
import type { PageIndexEntry } from '@/package/types';

export interface PagesIndexRequest {
  key: 'pages_index';
  value: PageIndexEntry[];
}

export const pagesAdapter: EntityAdapter<
  PageIndexEntry[],
  PageIndexEntry[],
  PageIndexEntry[]
> = {
  fromDto(dto) {
    return dto;
  },
  toInput(model) {
    return model;
  },
  toRequest(input): PagesIndexRequest {
    return {
      key: 'pages_index',
      value: input,
    };
  },
};
