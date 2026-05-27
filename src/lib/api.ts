/**
 * API 客户端
 * 封装所有与 worker-api 的通信
 */

import type {
  Product,
  Category,
  ProductInput,
  CategoryInput,
  CustomPage,
  R2Image,
  Blog,
  BlogInput,
  BlogCategory,
} from '../types';

const API_BASE = import.meta.env.VITE_IS_LOCAL_DEV === "true" ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL;

const ADMIN_TOKEN = import.meta.env.VITE_IS_LOCAL_DEV === "true" ? import.meta.env.VITE_ADMIN_TOKEN_LOCAL : import.meta.env.VITE_ADMIN_TOKEN;

// API 错误类型
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 通用请求函数
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 添加认证 Token
  if (ADMIN_TOKEN) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${ADMIN_TOKEN}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new ApiError(
      errorData.error || errorData.message || 'Request failed',
      response.status,
      errorData
    );
  }

  // 处理空响应
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text);
}

// 分页响应类型
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 商品列表查询参数
interface ProductsQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  featured?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'sales';
  search?: string;
}

// API 接口
export const api = {
  // ============================================
  // 商品 (保持为核心实体)
  // ============================================
  getProducts: (params?: ProductsQuery) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          query.set(key, String(value));
        }
      });
    }
    const queryStr = query.toString();
    return request<PaginatedResponse<Product>>(
      `/api/products${queryStr ? `?${queryStr}` : ''}`
    );
  },

  getProduct: (id: number) => request<Product>(`/api/products/${id}`),

  createProduct: (data: ProductInput) =>
    request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: number, data: Partial<ProductInput>) =>
    request<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: number) =>
    request<{ success: boolean }>(`/api/products/${id}`, {
      method: 'DELETE',
    }),

  // ============================================
  // 分类 (保持为核心实体)
  // ============================================
  getCategories: () => request<Category[]>('/api/categories'),

  createCategory: (data: CategoryInput) =>
    request<Category>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCategory: (id: string, data: Partial<CategoryInput>) =>
    request<Category>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteCategory: (id: string) =>
    request<{ success: boolean }>(`/api/categories/${id}`, {
      method: 'DELETE',
    }),

  // ============================================
  // 通用配置 KV 系统 (积木与页面全靠它通信)
  // ============================================
  getConfig: <T = unknown>(key: string) =>
    request<T>(`/api/config/${key}`).catch((err) => {
      // 如果配置不存在，返回 null
      if (err.status === 404) {
        return null;
      }
      throw err;
    }),

  setConfig: <T = unknown>(key: string, value: T) =>
    request<{ success: boolean }>('/api/config', {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    }),

  deleteConfig: (key: string) =>
    request<{ success: boolean }>(`/api/config/${key}`, {
      method: 'DELETE',
    }),

  getPageById: (id: string) => request<CustomPage>(`/api/config/pages/${id}`),

  // ============================================
  // 图片与静态资源上传
  // ============================================
  uploadImage: async (
    file: File,
    dimensions?: { width: number; height: number }
  ): Promise<{ url: string; thumbUrl: string; key: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (dimensions) {
      formData.append('width', dimensions.width.toString());
      formData.append('height', dimensions.height.toString());
    }

    const response = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new ApiError(error.error || 'Upload failed', response.status);
    }

    return response.json();
  },

  getImagesList: () => request<R2Image[]>('/api/upload/list'),

  deleteImage: (key: string) =>
    request<{ success: boolean }>(`/api/upload?key=${encodeURIComponent(key)}`, {
      method: 'DELETE',
    }),

  // ============================================
  // 询盘管理
  // ============================================
  getInquiries: () => request<PaginatedResponse<any>>('/api/inquiries'),
  patchInquiry: (id: number, data: { status: string }) =>
    request<{ success: boolean }>(`/api/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteInquiry: (id: number) =>
    request<{ success: boolean }>(`/api/inquiries/${id}`, {
      method: 'DELETE',
    }),

  // ============================================
  // 博客管理
  // ============================================
  getBlogs: (params?: { page?: number; pageSize?: number; status?: string; category?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
      });
    }
    const queryStr = query.toString();
    return request<{ data: Blog[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>(
      `/api/blogs${queryStr ? `?${queryStr}` : ''}`
    );
  },

  getBlog: (idOrSlug: string | number) => request<Blog>(`/api/blogs/${idOrSlug}`),

  createBlog: (data: BlogInput) =>
    request<{ id: number; message: string }>('/api/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateBlog: (id: number, data: Partial<BlogInput>) =>
    request<{ message: string }>(`/api/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteBlog: (id: number) =>
    request<{ message: string }>(`/api/blogs/${id}`, {
      method: 'DELETE',
    }),

  // Blog Categories
  getBlogCategories: () => request<BlogCategory[]>('/api/blog-categories'),

  createBlogCategory: (data: { name_zh: string; name_en: string; slug?: string; sort_order?: number }) =>
    request<{ id: number; message: string }>('/api/blog-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateBlogCategory: (id: number, data: { name_zh?: string; name_en?: string; slug?: string; sort_order?: number }) =>
    request<{ message: string }>(`/api/blog-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteBlogCategory: (id: number) =>
    request<{ message: string }>(`/api/blog-categories/${id}`, {
      method: 'DELETE',
    }),

  // ============================================
  // 系统管理 / 触发构建
  // ============================================
  triggerBuild: () =>
    request<{ success: boolean; buildStatus: { hasChanges: boolean; lastBuildTime: string } }>(
      '/api/system/trigger-build',
      {
        method: 'POST',
      }
    ),

  // ============================================
  // Customer Reviews (客户评价)
  // ============================================
  getAdminReviews: (params?: { page?: number; pageSize?: number; search?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) query.set(k, String(v));
      });
    }
    const qs = query.toString();
    return request<{ data: any[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>(
      `/api/admin/reviews${qs ? `?${qs}` : ''}`
    );
  },

  createReview: (data: import('../types').ReviewInput) =>
    request<{ id: number; message: string }>('/api/admin/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateReview: (id: number, data: Partial<import('../types').ReviewInput>) =>
    request<{ message: string }>(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteReview: (id: number) =>
    request<{ message: string }>(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
    }),
};

export default api;
