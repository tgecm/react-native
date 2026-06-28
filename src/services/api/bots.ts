import client from './client';

export const getBots = () =>
  client.get('/bots').then(res => res.data);

export const getBot = (id: number) =>
  client.get(`/bots/${id}`).then(res => res.data);

export const updateBot = (id: number, data: Record<string, any>) =>
  client.patch(`/bots/${id}`, data).then(res => res.data);

export const deleteBot = (id: number) =>
  client.delete(`/bots/${id}`).then(res => res.data);

export const getAiSettings = (botId: number) =>
  client.get(`/bots/${botId}/ai-settings`).then(res => res.data);

export const updateAiSettings = (botId: number, data: Record<string, any>) =>
  client.put(`/bots/${botId}/ai-settings`, data).then(res => res.data);
