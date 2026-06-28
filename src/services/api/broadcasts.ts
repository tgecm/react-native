import client from './client';

export const getBroadcasts = (params?: Record<string, any>) =>
  client.get('/broadcasts', { params }).then(res => res.data);

export const getGiveaways = (params?: Record<string, any>) =>
  client.get('/giveaways', { params }).then(res => res.data);

export const getGiveawayParticipants = (id: number) =>
  client.get(`/giveaways/${id}/participants`).then(res => res.data);

export const createBroadcast = (data: Record<string, any>) =>
  client.post('/broadcasts', data).then(res => res.data);

export const createGiveaway = (data: Record<string, any>) =>
  client.post('/giveaways', data).then(res => res.data);

export const drawGiveawayWinner = (id: number, data: Record<string, any>) =>
  client.post(`/giveaways/${id}/draw`, data).then(res => res.data);

export const getGiveawayWinners = (id: number) =>
  client.get(`/giveaways/${id}/winners`).then(res => res.data);
