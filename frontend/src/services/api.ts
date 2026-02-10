import axios from 'axios';
import type { ChatRequest, ChatResponse } from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const chatApi = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/chat', { message } as ChatRequest);
    return response.data;
  },
  
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};
