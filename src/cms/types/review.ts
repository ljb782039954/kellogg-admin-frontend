export type ReviewMediaType = "video" | "image";
export type ReviewStatus = "published" | "draft";


export interface CustomerReview {
  id: number;
  client_name: string;
  country: string | null;
  rating: number;
  media_type: ReviewMediaType;
  media_url: string;
  review_text_zh: string;
  review_text_en: string;
  sort_order: number;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

export interface ReviewInput {
  client_name: string;
  country?: string;
  rating?: number;
  media_type: ReviewMediaType;
  media_url: string;
  review_text_zh: string;
  review_text_en: string;
  sort_order?: number;
  status?: ReviewStatus;
}
