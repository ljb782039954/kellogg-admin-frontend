import { apiClient } from '@/shared/api/client';
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

export { ApiError, AppError } from '@/shared/api/errors';

const request = apiClient.request;

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ProductsQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  featured?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'sales';
  search?: string;
}

export const api = {
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
      `/api/products${queryStr ? `?${queryStr}` : ''}`,
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

  getConfig: <T = unknown>(key: string) =>
    request<T>(`/api/config/${key}`).catch((err) => {
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

  uploadImage: async (
    file: File,
    dimensions?: { width: number; height: number },
    hash?: string,
  ): Promise<{ url: string; thumbUrl: string; key: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    if (dimensions) {
      formData.append('width', dimensions.width.toString());
      formData.append('height', dimensions.height.toString());
    }
    if (hash) {
      formData.append('hash', hash);
    }

    return request('/api/upload', {
      method: 'POST',
      body: formData,
    });
  },

  getImagesList: () => request<R2Image[]>('/api/upload/list'),

  deleteImage: (key: string) =>
    request<{ success: boolean }>(`/api/upload?key=${encodeURIComponent(key)}`, {
      method: 'DELETE',
    }),

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

  getBlogs: (params?: { page?: number; pageSize?: number; status?: string; category?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
      });
    }
    const queryStr = query.toString();
    return request<{ data: Blog[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>(
      `/api/blogs${queryStr ? `?${queryStr}` : ''}`,
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

  triggerBuild: () =>
    request<{ success: boolean; buildStatus: { hasChanges: boolean; lastBuildTime: string } }>(
      '/api/system/trigger-build',
      {
        method: 'POST',
      },
    ),

  getAdminReviews: (params?: { page?: number; pageSize?: number; search?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) query.set(k, String(v));
      });
    }
    const qs = query.toString();
    return request<{ data: any[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>(
      `/api/admin/reviews${qs ? `?${qs}` : ''}`,
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
