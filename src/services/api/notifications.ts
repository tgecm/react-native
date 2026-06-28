import client from './client';

export const registerDeviceToken = (token: string) =>
  client.post('/notifications/register', { token }).then(r => r.data);

export const unregisterDeviceToken = () =>
  client.delete('/notifications/register').then(r => r.data);
