import { create } from 'zustand';
import type { Message, WeatherData } from '../types';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  weatherData: WeatherData | null;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  appendToLastAssistantMessage: (content: string) => void;
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

  appendToLastAssistantMessage: (content) =>
    set((state) => {
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        return {
          messages: [
            ...state.messages.slice(0, -1),
            {
              ...lastMessage,
              content: lastMessage.content + content,
            },
          ],
        };
      }
      return state;
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setWeatherData: (data) => set({ weatherData: data }),

  clearChat: () => set({ messages: [], weatherData: null }),
}));
