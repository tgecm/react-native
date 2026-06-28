import client from './client';

export const getPublicShop = (slug: string) =>
  client.get(`/public/shop/${slug}`).then(res => res.data);

export const getPublicTopProducts = (slug: string, limit = 10) =>
  client.get(`/public/shop/${slug}/top-products`, { params: { limit } }).then(res => res.data);

export const getBotPublicSlug = (botId: number | string) =>
  client.get(`/bots/${botId}/public-slug`).then(res => res.data);

export const generateBotSlug = (botId: number | string) =>
  client.post(`/bots/${botId}/generate-slug`).then(res => res.data);

export const setBotDomain = (botId: number | string, domain: string) =>
  client.post(`/bots/${botId}/set-domain`, { domain }).then(res => res.data);

export const getBotDomainStatus = (botId: number | string) =>
  client.get(`/bots/${botId}/domain-status`).then(res => res.data);

export const verifyBotDomain = (botId: number | string) =>
  client.post(`/bots/${botId}/verify-domain`).then(res => res.data);

export const toggleBotDomain = (botId: number | string, enabled: boolean) =>
  client.post(`/bots/${botId}/toggle-domain`, null, { params: { enabled } }).then(res => res.data);

export const deleteBotDomain = (botId: number | string) =>
  client.delete(`/bots/${botId}/domain`).then(res => res.data);

export const listBotDomains = (botId: number | string) =>
  client.get(`/bots/${botId}/domains`).then(res => res.data);

export const addBotDomain = (botId: number | string, domain: string) =>
  client.post(`/bots/${botId}/domains`, { domain }).then(res => res.data);

export const verifyBotDomainItem = (botId: number | string, domainId: number) =>
  client.post(`/bots/${botId}/domains/${domainId}/verify`).then(res => res.data);

export const toggleBotDomainItem = (botId: number | string, domainId: number, enabled: boolean) =>
  client.post(`/bots/${botId}/domains/${domainId}/toggle`, null, { params: { enabled } }).then(res => res.data);

export const deleteBotDomainItem = (botId: number | string, domainId: number) =>
  client.delete(`/bots/${botId}/domains/${domainId}`).then(res => res.data);

export const getPublicNewsfeed = (botId: number | string, visitorId?: string, limit = 10, offset = 0, topic = '') =>
  client.get(`/public/newsfeed/${botId}`, { params: { visitor_id: visitorId, limit, offset, topic } }).then(res => res.data || []);

export const getPublicNewsfeedComments = (postId: number) =>
  client.get(`/public/newsfeed/${postId}/comments`).then(res => res.data);

export const toggleNewsfeedLike = (postId: number, visitorId: string) =>
  client.post(`/public/newsfeed/${postId}/like`, { visitor_id: visitorId }).then(res => res.data);

export const addNewsfeedComment = (postId: number, visitorId: string, content: string, visitorName?: string) =>
  client.post(`/public/newsfeed/${postId}/comment`, { visitor_id: visitorId, content, visitor_name: visitorName }).then(res => res.data);

export const editNewsfeedComment = (postId: number, commentId: number, visitorId: string, content: string) =>
  client.patch(`/public/newsfeed/${postId}/comment/${commentId}`, { visitor_id: visitorId, content }).then(res => res.data);

export const deleteNewsfeedComment = (postId: number, commentId: number, visitorId: string) =>
  client.delete(`/public/newsfeed/${postId}/comment/${commentId}?visitor_id=${visitorId}`).then(res => res.data);

export const createPlanOrder = (botId: number | string, planName: string, planType: string, discountCode?: string) =>
  client.post('/public/create-plan-order', {
    bot_id: botId,
    plan_name: planName,
    plan_type: planType,
    ...(discountCode ? { discount_code: discountCode } : {}),
  }).then(res => res.data);

export const validateSubscriptionDiscount = (code: string) =>
  client.post('/public/validate-subscription-discount', { code }).then(res => res.data);
