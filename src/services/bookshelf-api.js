import { apiClient } from './api';

export async function fetchBooks() {
  const { data } = await apiClient.get('/books');
  return data;
}

export async function fetchBookById(bookId) {
  const { data } = await apiClient.get(`/books/${bookId}`);
  return data;
}
