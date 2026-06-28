import client from './client';

export const getNewsfeedPosts = (botId: number | string) =>
  client.get('/newsfeed/posts', { params: { bot_id: botId } }).then(res => res.data);

export const createNewsfeedPost = (data: Record<string, any>) =>
  client.post('/newsfeed/posts', data).then(res => res.data);

export const updateNewsfeedPost = (postId: number, data: Record<string, any>) =>
  client.patch(`/newsfeed/posts/${postId}`, data).then(res => res.data);

export const deleteNewsfeedPost = (postId: number) =>
  client.delete(`/newsfeed/posts/${postId}`).then(res => res.data);

export const getNewsfeedPostComments = (postId: number) =>
  client.get(`/newsfeed/posts/${postId}/comments`).then(res => res.data);

export const adminDeleteNewsfeedComment = (postId: number, commentId: number) =>
  client.delete(`/newsfeed/posts/${postId}/comments/${commentId}`).then(res => res.data);
