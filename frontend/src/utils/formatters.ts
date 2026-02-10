import axios from 'axios';
import type { ChatRequest, ChatResponse, WeatherData } from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
});

export const chatApi = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/chat', { message });
    return response.data;
  },
  
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
