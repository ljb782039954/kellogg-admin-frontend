export * from "./common";
export * from "./products";
export * from "./blog";
export * from "./review";
// export * from "./editor";
export * from "./baseEditor";

import type { CompanyInfo, HeaderContent, FooterContent } from "./baseEditor";
import type { CustomPage } from "@/site-package/kellogg/types/blocks";

// ============================================
// 核心聚合与 API 响应类型
// ============================================

export interface SiteContent {
  companyInfo: CompanyInfo;
  header: HeaderContent;
  footer: FooterContent;
  pages: CustomPage[];
}


// ============================================
// 响应类型封装
// ============================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
