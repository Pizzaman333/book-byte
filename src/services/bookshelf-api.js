import axios from 'axios';

axios.defaults.baseURL = 'https://681f2acf72e59f922ef56c3a.mockapi.io/codechronicles';

export async function fetchBooks() {
  const { data } = await axios.get(`/books`);
  return data;
}

export async function fetchBookById(bookId) {
  const { data } = await axios.get(`/books/${bookId}`);
  return data;
}