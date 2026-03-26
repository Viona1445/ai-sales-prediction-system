import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  // Otomatis bisa menambah interceptor token disini kedepannya jika API diamankan secara menyeluruh
});

export const loginAPI = async (username, password) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const getSalesAPI = async () => {
  const response = await api.get('/sales');
  return response.data;
};

export const predictSalesAPI = async (data) => {
  const response = await api.post('/predict', data);
  return response.data;
};

export default api;
