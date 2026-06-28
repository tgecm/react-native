import client from './client';

export const getPaymentMethods = (params?: Record<string, any>) =>
  client.get('/payment-methods', { params }).then(res => res.data);

export const createPayment = (data: Record<string, any>) =>
  client.post('/payment-methods', data).then(res => res.data);

export const updatePayment = (id: number, data: Record<string, any>) =>
  client.patch(`/payment-methods/${id}`, data).then(res => res.data);

export const deletePayment = (id: number) =>
  client.delete(`/payment-methods/${id}`).then(res => res.data);

export const getCodSettings = (botId: number | string) =>
  client.get(`/cod-settings/${botId}`).then(res => res.data);

export const updateCodSettings = (botId: number | string, data: Record<string, any>) =>
  client.post(`/cod-settings/${botId}`, data).then(res => res.data);
