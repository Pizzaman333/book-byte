import axios from 'axios';

export async function fetchCart() {
  const { data } = await axios.get('/cart/1');
  return data.items;
}

export async function updateCart(newItems) {
  const { data } = await axios.put('/cart/1', { items: newItems });
  return data.items;
}