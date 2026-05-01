import { apiClient } from './api';

export async function fetchCart() {
  const { data } = await apiClient.get('/cart/1');
  return data.items;
}

export async function updateCart(newItems) {
  const { data } = await apiClient.put('/cart/1', { items: newItems });
  return data.items;
}
