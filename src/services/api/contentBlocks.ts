import client from './client';

export const getContentBlocks = (params?: Record<string, any>) =>
  client.get('/content-blocks', { params }).then(res => res.data);

export const updateContentBlock = (botId: number | string, key: string, data: Record<string, any>) =>
  client.put(`/content-blocks/${botId}/${key}`, data).then(res => res.data);
