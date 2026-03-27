import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const queryService = {
  submitQuery: async (question) => {
    const response = await api.post('/query', { question });
    return response.data;
  },
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
  getLogs: async () => {
    const response = await api.get('/logs');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  }
};
