import { z } from 'zod';
import type { ReviewFormValues } from './review.types';

export const reviewSchema: z.ZodType<ReviewFormValues> = z.object({
  clientName: z.string().min(1, '请填写客户名称'),
  country: z.string(),
  rating: z.number().min(1).max(5),
  media: z.object({
    type: z.enum(['video', 'image']),
    url: z.string().min(1, '请填写媒体链接或上传图片'),
  }),
  content: z.object({
    zh: z.string().min(1, '请填写中文评价内容'),
    en: z.string().min(1, '请填写英文评价内容'),
  }),
  sortOrder: z.number().int().min(0),
  status: z.enum(['published', 'draft']),
});
