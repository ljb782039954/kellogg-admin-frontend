import type { EntityAdapter } from '@/core/contracts';
import type {
  Inquiry,
  InquiryDto,
  InquiryStatusInput,
} from '@/package/types';

export const inquiryAdapter: EntityAdapter<
  Inquiry,
  InquiryDto,
  InquiryStatusInput
> = {
  fromDto(dto) {
    if (dto.status !== 'pending' && dto.status !== 'processed') {
      throw new Error(`Unknown inquiry status: ${dto.status}`);
    }

    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      country: dto.country,
      company: dto.company,
      productType: dto.product_type,
      quantity: dto.quantity,
      message: dto.message,
      status: dto.status,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at ?? null,
    };
  },
  toInput(model) {
    return { status: model.status };
  },
  toRequest(input) {
    return input;
  },
};
