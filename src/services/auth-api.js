import axios from 'axios';

export const authApiClient = axios.create({
  baseURL: 'https://connections-api.goit.global',
});

export function setAuthHeader(token) {
  authApiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearAuthHeader() {
  delete authApiClient.defaults.headers.common.Authorization;
}

export async function signup(credentials) {
  const { data } = await authApiClient.post('/users/signup', credentials);
  return data;
}

export async function login(credentials) {
  const { data } = await authApiClient.post('/users/login', credentials);
  return data;
}

export async function logout() {
  const { data } = await authApiClient.post('/users/logout');
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await authApiClient.get('/users/current');
  return data;
}
