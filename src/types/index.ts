// ── Auth Types ──────────────────────────────────────────────
export interface User {
  id: number;
  email?: string;
  name?: string;
  is_superadmin: boolean;
  bot_id?: number;
  bot_ids?: number[];
  plan?: string;
  plan_status?: string;
  tg_username?: string;
  photo_url?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isSuperadmin: boolean;
  isStaff: boolean;
}

// ── Bot Types ──────────────────────────────────────────────
export interface Bot {
  id: number;
  name: string;
  username: string;
  token: string;
  status?: string;
  plan?: string;
  plan_status?: string;
  ai_settings?: AiSettings;
  public_slug?: string;
}

export interface AiSettings {
  enabled: boolean;
  api_key?: string;
  model?: string;
  instructions?: string;
}

// ── Product Types ──────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  compare_price?: number;
  category_id?: number;
  category_name?: string;
  image_url?: string;
  stock?: number;
  sort_order?: number;
  status?: string;
  created_at?: string;
  options?: ProductOption[];
  colors?: string[];
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Category {
  id: number;
  name: string;
  bot_id: number;
  sort_order?: number;
  product_count?: number;
}

// ── Order Types ────────────────────────────────────────────
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  bot_id: number;
  user_id: number;
  customer_name?: string;
  customer_phone?: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  payment_method?: string;
  payment_status?: string;
  shipping_address?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  selected_color?: string;
  selected_options?: Record<string, string>;
}

// ── Customer Types ─────────────────────────────────────────
export interface Customer {
  id: number;
  tg_user_id?: number;
  name?: string;
  username?: string;
  phone?: string;
  photo_url?: string;
  order_count?: number;
  total_spent?: number;
  created_at?: string;
}

// ── Chat Types ─────────────────────────────────────────────
export interface Chat {
  user_id: number;
  name?: string;
  username?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  photo_url?: string;
}

export interface ChatMessage {
  id: number;
  text?: string;
  file_id?: string;
  file_type?: string;
  sender: 'bot' | 'user';
  timestamp: string;
}

// ── Broadcast Types ────────────────────────────────────────
export interface Broadcast {
  id: number;
  bot_id: number;
  message: string;
  status: string;
  sent_count?: number;
  total_count?: number;
  created_at: string;
}

export interface Giveaway {
  id: number;
  bot_id: number;
  title: string;
  prize: string;
  status: string;
  winner_count: number;
  created_at: string;
}

// ── Payment Types ──────────────────────────────────────────
export interface PaymentMethod {
  id: number;
  bot_id: number;
  type: string;
  name: string;
  details?: string;
  photo_url?: string;
  status: string;
}

export interface CodSettings {
  enabled: boolean;
  min_amount?: number;
  max_amount?: number;
  delivery_fee?: number;
  areas?: string[];
}

// ── Stats Types ────────────────────────────────────────────
export interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  total_products: number;
  total_customers: number;
  pending_orders: number;
  today_orders: number;
  today_revenue: number;
}

export interface OrdersByDay {
  date: string;
  count: number;
  revenue: number;
}

export interface TopProduct {
  id: number;
  name: string;
  total_quantity: number;
  total_revenue: number;
}

// ── Newsfeed Types ─────────────────────────────────────────
export interface NewsfeedPost {
  id: number;
  bot_id: number;
  title?: string;
  content: string;
  image_url?: string;
  topic?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface NewsfeedComment {
  id: number;
  post_id: number;
  visitor_id?: string;
  visitor_name?: string;
  content: string;
  created_at: string;
}

// ── QR Menu Types ──────────────────────────────────────────
export interface QRMenuItem {
  id: number;
  bot_id: number;
  category_id?: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  status: string;
  sort_order?: number;
}

export interface QRMenuCategory {
  id: number;
  bot_id: number;
  name: string;
  sort_order?: number;
}

export interface QRMenuCustomer {
  id: number;
  name: string;
  phone?: string;
  points: number;
  total_orders: number;
  total_spent: number;
}

// ── Superadmin Types ───────────────────────────────────────
export interface PlanPayment {
  id: number;
  bot_id: number;
  bot_name?: string;
  plan: string;
  amount: number;
  status: string;
  payment_method?: string;
  created_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  sort_order?: number;
}

export interface StaffLog {
  id: number;
  staff_id: number;
  staff_name?: string;
  action: string;
  details?: string;
  created_at: string;
}

// ── Subscription Types ─────────────────────────────────────
export interface SubscriptionDiscount {
  id: number;
  code: string;
  discount_percent: number;
  max_uses?: number;
  current_uses: number;
  expires_at?: string;
  status: string;
}

// ── Coupon Types ───────────────────────────────────────────
export interface Coupon {
  id: number;
  bot_id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_spend: number;
  end_date: string;
  total_coupons: number;
  used_count: number;
  status: string;
}

// ── Config / Telegram Auth Types ───────────────────────────
export type TelegramLoginStatus = 'idle' | 'waiting' | 'confirmed' | 'declined' | 'expired' | 'error';

export interface TelegramLoginInitResponse {
  token: string;
  bot_username: string;
  login_url: string;
}

export interface TelegramPollResponse {
  status: 'pending' | 'confirmed' | 'declined' | 'expired';
  token?: string;
  user?: {
    id: number;
    name: string;
    username?: string;
    photo_url?: string;
  };
}

export interface TelegramUserProfile {
  id: number;
  name: string;
  username?: string;
  photo_url?: string;
}

// ── Plan Types ─────────────────────────────────────────────
export type PlanName = 'basic' | 'standard' | 'pro' | 'business';

export type PlanFeature =
  | 'ai_agent'
  | 'ecommerce_website'
  | 'custom_domain'
  | 'change_order_button_name'
  | 'new_order_email_notification'
  | 'shop_banner'
  | 'watermark_removed'
  | 'qr_menu'
  | 'staff_accounts';

// ── Navigation Types ──────────────────────────────────────
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  StaffLogin: undefined;
  VerifyCode: { loginToken: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Products: undefined;
  Customers: undefined;
  More: undefined;
};

export type DrawerParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Products: undefined;
  Customers: undefined;
  Chats: undefined;
  Broadcast: undefined;
  Payments: undefined;
  Commands: undefined;
  Subscription: undefined;
  Settings: undefined;
  Customization: undefined;
  Newsfeed: undefined;
  QRMenu: undefined;
  Superadmin: undefined;
  StaffAccounts: undefined;
  FAQs: undefined;
  Subscribers: undefined;
};
