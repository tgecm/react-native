import client from './client';

export const getProducts = (params?: Record<string, any>) =>
  client.get('/products', { params }).then(res => res.data);

export const getCategories = (params?: Record<string, any>) =>
  client.get('/categories', { params }).then(res => res.data);

export const createProduct = (data: Record<string, any>) =>
  client.post('/products', data).then(res => res.data);

export const updateProduct = (id: number, data: Record<string, any>) =>
  client.patch(`/products/${id}`, data).then(res => res.data);

export const deleteProduct = (id: number) =>
  client.delete(`/products/${id}`).then(res => res.data);

export const createCategory = (data: Record<string, any>) =>
  client.post('/categories', data).then(res => res.data);

export const updateCategory = (id: number, data: Record<string, any>) =>
  client.patch(`/categories/${id}`, data).then(res => res.data);

export const deleteCategory = (id: number) =>
  client.delete(`/categories/${id}`).then(res => res.data);

export const uploadImage = (file: any, botId: string | number) => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri || file.path,
    type: file.type || 'image/jpeg',
    name: file.fileName || 'photo.jpg',
  } as any);
  return client.post(`/upload/image?bot_id=${botId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data);
};

export const updateProductSortOrder = (botId: number | string, items: { id: number; sort_order: number }[]) =>
  client.put('/products/sort-order', { bot_id: Number(botId), items }).then(res => res.data);
