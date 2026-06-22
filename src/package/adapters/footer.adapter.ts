import type { EntityAdapter } from '@/core/contracts';
import type { FooterContent } from '@/package/types';

export interface FooterRequest {
  key: 'footer_config';
  value: FooterContent;
}

export const footerAdapter: EntityAdapter<
  FooterContent,
  FooterContent,
  FooterContent
> = {
  fromDto(dto) {
    return dto;
  },
  toInput(model) {
    return model;
  },
  toRequest(input): FooterRequest {
    return {
      key: 'footer_config',
      value: input,
    };
  },
};
