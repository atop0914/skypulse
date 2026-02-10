import { create } from 'zustand';
import type { Message, WeatherData } from '../types';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  weatherData: WeatherData | null;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  setLoading: (loading: boolean) => void;
  setWeatherData: (data: WeatherData) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  weatherData: null,
  
  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now().toString(),
          role,
          content,
          timestamp: Date.now(),
        },
      ],
    })),
    
  setLoading: (loading) => set({ isLoading: loading }),
  
  setWeatherData: (data) => set({ weatherData: data }),
  
  clearChat: () => set({ messages: [], weatherData: null }),
}));
