import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://681f2acf72e59f922ef56c3a.mockapi.io/codechronicles',
});
