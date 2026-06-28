import client from './client';

export const getStats = (params?: Record<string, any>) =>
  client.get('/stats', { params }).then(res => res.data);

export const getOrdersByDay = (params?: Record<string, any>) =>
  client.get('/stats/orders-by-day', { params }).then(res => res.data);

export const getTopProducts = (params?: Record<string, any>) =>
  client.get('/stats/top-products', { params }).then(res => res.data);

export const getUsersByDay = (params?: Record<string, any>) =>
  client.get('/stats/users-by-day', { params }).then(res => res.data);

export const getProfitSummary = (params?: Record<string, any>) =>
  client.get('/stats/profit-summary', { params }).then(res => res.data);
