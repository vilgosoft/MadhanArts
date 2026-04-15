// ──────────────────────────────────────
// Madhan Arts — TypeScript Interfaces
// ──────────────────────────────────────

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'admin';
}

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  role: 'user';
}

export type AuthUser = Admin | User;

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  sort_order: number;
  is_active: number;
  created_at: string;
}

export interface GalleryItem {
  id: number;
  category_id: number;
  image_url: string;
  title: string | null;
  category_name: string;
  category_slug?: string;
  sort_order: number;
  is_active: number;
  created_at: string;
}

export interface Size {
  id: number;
  label: string;
  description: string | null;
  sort_order: number;
  is_active: number;
}

export interface PricingRule {
  id: number;
  category_id: number;
  size_id: number;
  price: string; // decimal comes as string from API
  currency: string;
  category_name?: string;
  size_label: string;
  size_description?: string;
  is_active: number;
}

export interface PriceCalculation {
  category_name: string;
  size_label: string;
  price: string;
  currency: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'received' | 'in_progress' | 'completed' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  category_id: number;
  size_id: number;
  pricing_rule_id: number;
  reference_photo: string;
  delivery_address: string;
  needed_by_date: string | null;
  amount: string;
  currency: string;
  payment_gateway: string | null;
  payment_id: string | null;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  admin_notes: string | null;
  category_name: string;
  size_label: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/** Customer accounts (admin user list) */
export interface UserListRow {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedUsers {
  users: UserListRow[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PhonePeInitiateData {
  order_id: number;
  merchant_transaction_id: string;
  redirect_url: string | null;
  phonepe?: {
    state?: string | null;
    response_code?: string | null;
  };
}

export interface PhonePeVerifyData {
  order: Order;
  phonepe?: unknown;
}
