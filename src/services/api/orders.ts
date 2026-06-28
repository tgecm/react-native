import client from './client';

export const getOrders = (params?: Record<string, any>) =>
  client.get('/orders', { params }).then(res => res.data);

export const updateOrderStatus = (id: number, data: Record<string, any>) =>
  client.patch(`/orders/${id}/status`, data).then(res => res.data);

export const getPendingOrderCount = (botId: number | string) =>
  client.get('/orders/pending-count', { params: { bot_id: botId } }).then(res => res.data);

export const getQRMenuOrders = (botId: number | string, { limit = 100, offset = 0 } = {}) =>
  client.get(`/qr-menu/${botId}/orders`, { params: { limit, offset } }).then(res => res.data);

export const getQRMenuPendingCount = (botId: number | string) =>
  client.get(`/qr-menu/${botId}/orders/pending-count`).then(res => res.data);

export const generateInvoiceNumber = (orderId: number) =>
  client.post(`/orders/${orderId}/invoice-number`).then(res => res.data);
