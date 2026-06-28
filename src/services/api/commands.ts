import client from './client';

export const getCustomCommands = (params?: Record<string, any>) =>
  client.get('/custom-commands', { params }).then(res => res.data);

export const createCustomCommand = (data: Record<string, any>) =>
  client.post('/custom-commands', data).then(res => res.data);

export const deleteCustomCommand = (id: number) =>
  client.delete(`/custom-commands/${id}`).then(res => res.data);
