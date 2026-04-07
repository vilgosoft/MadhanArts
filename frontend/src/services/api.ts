import axios from 'axios';
import type {
  ApiResponse,
  AuthResponse,
  Category,
  GalleryItem,
  Size,
  PricingRule,
  PriceCalculation,
  Order,
  PaginatedOrders,
  PaginatedUsers,
  UserListRow,
  AuthUser,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ──────────────────────────────────────
// Auth
// ──────────────────────────────────────
export const authApi = {
  adminLogin: (email: string, password: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/admin/login', { email, password }),

  register: (name: string, email?: string, phone?: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', { name, email, phone }),

  login: (email?: string, phone?: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', { email, phone }),

  me: () =>
    api.get<ApiResponse<AuthUser>>('/auth/me'),
};

// ──────────────────────────────────────
// Categories
// ──────────────────────────────────────
export const categoryApi = {
  list: () =>
    api.get<ApiResponse<Category[]>>('/categories'),

  listAll: () =>
    api.get<ApiResponse<Category[]>>('/categories/all'),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Category>>(`/categories/${slug}`),

  create: (data: Partial<Category>) =>
    api.post<ApiResponse<Category>>('/categories', data),

  update: (id: number, data: Partial<Category>) =>
    api.put<ApiResponse<Category>>(`/categories/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/categories/${id}`),
};

// ──────────────────────────────────────
// Gallery
// ──────────────────────────────────────
export const galleryApi = {
  list: () =>
    api.get<ApiResponse<GalleryItem[]>>('/gallery'),

  byCategory: (categoryId: number) =>
    api.get<ApiResponse<{ category: Category; items: GalleryItem[] }>>(`/gallery/category/${categoryId}`),

  upload: (formData: FormData) =>
    api.post<ApiResponse<GalleryItem>>('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: number, data: Partial<GalleryItem>) =>
    api.put<ApiResponse<GalleryItem>>(`/gallery/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/gallery/${id}`),
};

// ──────────────────────────────────────
// Sizes
// ──────────────────────────────────────
export const sizeApi = {
  list: () =>
    api.get<ApiResponse<Size[]>>('/sizes'),

  create: (data: Partial<Size>) =>
    api.post<ApiResponse<Size>>('/sizes', data),

  update: (id: number, data: Partial<Size>) =>
    api.put<ApiResponse<Size>>(`/sizes/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/sizes/${id}`),
};

// ──────────────────────────────────────
// Pricing
// ──────────────────────────────────────
export const pricingApi = {
  list: () =>
    api.get<ApiResponse<PricingRule[]>>('/pricing'),

  byCategory: (categoryId: number) =>
    api.get<ApiResponse<PricingRule[]>>(`/pricing/category/${categoryId}`),

  calculate: (categoryId: number, sizeId: number) =>
    api.get<ApiResponse<PriceCalculation>>('/pricing/calculate', {
      params: { category_id: categoryId, size_id: sizeId },
    }),

  create: (data: { category_id: number; size_id: number; price: number }) =>
    api.post<ApiResponse<PricingRule>>('/pricing', data),

  update: (id: number, data: Partial<PricingRule>) =>
    api.put<ApiResponse<PricingRule>>(`/pricing/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/pricing/${id}`),
};

// ──────────────────────────────────────
// Users (admin)
// ──────────────────────────────────────
export const userApi = {
  list: (page = 1, limit = 20) =>
    api.get<ApiResponse<PaginatedUsers>>('/users', { params: { page, limit } }),

  update: (id: number, data: { name: string; email?: string; phone?: string }) =>
    api.put<ApiResponse<UserListRow>>(`/users/${id}`, data),
};

// ──────────────────────────────────────
// Orders
// ──────────────────────────────────────
export const orderApi = {
  create: (formData: FormData) =>
    api.post<ApiResponse<Order>>('/orders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  list: (page = 1, limit = 20, status?: string) =>
    api.get<ApiResponse<PaginatedOrders>>('/orders', {
      params: { page, limit, status },
    }),

  get: (id: number) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`),

  updateStatus: (id: number, order_status: string, admin_notes?: string) =>
    api.put<ApiResponse<Order>>(`/orders/${id}/status`, { order_status, admin_notes }),
};

export default api;
