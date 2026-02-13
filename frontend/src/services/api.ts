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

// 获取客户端 IP 地址
let cachedIp: string | null = null;
export async function getClientIP(): Promise<string | null> {
  if (cachedIp) return cachedIp;
  
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      mode: 'cors',
    });
    const data = await response.json();
    cachedIp = data.ip;
    return cachedIp;
  } catch (e) {
    console.error('获取客户端IP失败:', e);
    return null;
  }
}

export const chatApi = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    const ip = await getClientIP();
    const response = await api.post<ChatResponse>('/chat', { message, ip } as ChatRequest);
    return response.data;
  },

  sendMessageStream: async (
    message: string,
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    const ip = await getClientIP();
    
    const response = await fetch('/api/v1/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, ip }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const lines = text.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            return;
          }
          if (data) {
            onChunk(data);
          }
        }
      }
    }
  },

  healthCheck: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};
