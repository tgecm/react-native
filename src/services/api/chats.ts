import client from './client';

export const getChats = (botId: number | string) =>
  client.get('/chats', { params: { bot_id: botId } }).then(res => res.data);

export const getChatMessages = (userId: number | string, botId: number | string) =>
  client.get(`/chats/${userId}/messages`, { params: { bot_id: botId } }).then(res => res.data);

export const sendChatMessage = (
  userId: number | string,
  botId: number | string,
  message: string,
  fileId?: string,
  fileType?: string,
) =>
  client.post(`/chats/${userId}/send`, { bot_id: botId, message, file_id: fileId, file_type: fileType }).then(res => res.data);

export const deleteChat = (userId: number | string, botId: number | string) =>
  client.delete(`/chats/${userId}`, { params: { bot_id: botId } }).then(res => res.data);

export const markChatRead = (userId: number | string, botId: number | string) =>
  client.post(`/chats/${userId}/mark-read`, { bot_id: botId }).then(res => res.data);

export const markChatUnread = (userId: number | string, botId: number | string) =>
  client.post(`/chats/${userId}/mark-unread`, { bot_id: botId }).then(res => res.data);

export const getWebVisitors = (botId: number | string) =>
  client.get(`/web-visitors/${botId}`).then(res => res.data);

export const getWebVisitorMessages = (visitorId: number | string, botId: number | string) =>
  client.get(`/web-visitors/${visitorId}/messages`, { params: { bot_id: botId } }).then(res => res.data);

export const sendWebVisitorMessage = (
  visitorId: number | string,
  botId: number | string,
  message: string,
  fileId?: string,
  fileType?: string,
) =>
  client.post(`/web-visitors/${visitorId}/send`, { bot_id: botId, message, file_id: fileId, file_type: fileType }).then(res => res.data);

export const deleteWebVisitor = (visitorId: number | string, botId: number | string) =>
  client.delete(`/web-visitors/${visitorId}`, { params: { bot_id: botId } }).then(res => res.data);

export const getUnreadCount = (botId: number | string) =>
  client.get('/chats/unread-count', { params: { bot_id: botId } }).then(res => res.data);
