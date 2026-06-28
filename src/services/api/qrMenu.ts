import client from './client';

export const getQRMenuItems = (botId: number | string) =>
  client.get(`/qr-menu/${botId}`).then(res => res.data);

export const createQRMenuItem = (data: Record<string, any>) =>
  client.post('/qr-menu', data).then(res => res.data);

export const updateQRMenuItem = (id: number, data: Record<string, any>) =>
  client.put(`/qr-menu/${id}`, data).then(res => res.data);

export const deleteQRMenuItem = (id: number) =>
  client.delete(`/qr-menu/${id}`).then(res => res.data);

export const getQRMenuCategories = (botId: number | string) =>
  client.get(`/qr-menu/${botId}/categories`).then(res => res.data);

export const createQRMenuCategory = (data: Record<string, any>) =>
  client.post('/qr-menu/categories', data).then(res => res.data);

export const updateQRMenuCategory = (id: number, data: Record<string, any>) =>
  client.put(`/qr-menu/categories/${id}`, data).then(res => res.data);

export const deleteQRMenuCategory = (id: number) =>
  client.delete(`/qr-menu/categories/${id}`).then(res => res.data);

// ── Customer / Points / Coupons ──
export const identifyCustomer = (phone: string, botId: number | string, name?: string) =>
  client.post('/public/qr-menu/customer/identify', { phone, bot_id: botId, name }).then(r => r.data);

export const redeemPoints = (customerId: number, pointsToUse: number, orderTotal: number, botId: number | string) =>
  client.post('/public/qr-menu/customer/redeem-points', {
    customer_id: customerId, points_to_use: pointsToUse, order_total: orderTotal, bot_id: botId,
  }).then(r => r.data);

export const validateCoupon = (code: string, orderTotal: number, botId: number | string) =>
  client.post('/public/qr-menu/coupon/validate', { code, order_total: orderTotal, bot_id: botId }).then(r => r.data);

export const getQRMenuCustomers = (botId: number | string, search = '') =>
  client.get('/admin/qr-menu/customers', { params: { bot_id: botId, search } }).then(r => r.data);

export const getQRMenuCustomerDetail = (customerId: number, botId: number | string) =>
  client.get(`/admin/qr-menu/customers/${customerId}`, { params: { bot_id: botId } }).then(r => r.data);

export const adjustCustomerPoints = (customerId: number, botId: number | string, points: number, reason: string) =>
  client.post(`/admin/qr-menu/customers/${customerId}/adjust-points`, { bot_id: botId, points, reason }).then(r => r.data);

export const getQRMenuCoupons = (botId: number | string) =>
  client.get('/admin/qr-menu/coupons', { params: { bot_id: botId } }).then(r => r.data);

export const createQRMenuCoupon = (data: Record<string, any>) =>
  client.post('/admin/qr-menu/coupons', data).then(r => r.data);

export const deleteQRMenuCoupon = (couponId: number, botId: number | string) =>
  client.delete(`/admin/qr-menu/coupons/${couponId}`, { params: { bot_id: botId } }).then(r => r.data);

export const getQRMenuStats = ({ bot_id, days, start_date, end_date }: { bot_id: number | string; days?: number; start_date?: string; end_date?: string }) =>
  client.get(`/qr-menu/${bot_id}/stats`, { params: { days, start_date, end_date } }).then(r => r.data);
