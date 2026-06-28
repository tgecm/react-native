import client from './client';

export const login = (email: string, password: string) =>
  client.post('/auth/login', { email, password }).then(res => res.data);

export const verifyLoginCode = (loginToken: string, code: string) =>
  client.post('/auth/login/verify', { login_token: loginToken, code }).then(res => res.data);

export const getMe = () =>
  client.get('/me').then(res => res.data);

export const pollLoginApproval = (loginToken: string) =>
  client.get('/auth/login/poll', { params: { login_token: loginToken } }).then(res => res.data);

export const getLoginAudit = () =>
  client.get('/api/audit/logins').then(res => res.data);

export const staffLogin = (username: string, password: string) =>
  client.post('/auth/staff-login', { username, password }).then(res => res.data);
