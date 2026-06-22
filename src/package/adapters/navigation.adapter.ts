import type { EntityAdapter } from '@/core/contracts';
import type { HeaderContent } from '@/package/types';

export interface NavigationRequest {
  key: 'header_config';
  value: HeaderContent;
}

export const navigationAdapter: EntityAdapter<
  HeaderContent,
  HeaderContent,
  HeaderContent
> = {
  fromDto(dto) {
    return dto;
  },
  toInput(model) {
    return model;
  },
  toRequest(input): NavigationRequest {
    return {
      key: 'header_config',
      value: input,
    };
  },
};
