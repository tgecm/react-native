import client from './client';

export const getUsers = (params?: Record<string, any>) =>
  client.get('/users', { params }).then(res => res.data);

export const updateUser = (id: number, data: Record<string, any>) =>
  client.patch(`/users/${id}`, data).then(res => res.data);

export const getWebCustomers = (botId: number | string) =>
  client.get(`/website-customers/${botId}`).then(res => res.data);
