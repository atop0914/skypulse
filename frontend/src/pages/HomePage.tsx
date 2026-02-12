import React from 'react';
import { Header } from '../components/Header';
import { ChatWindow } from '../components/ChatWindow';
import { ChatInput } from '../components/ChatInput';
import { WeatherCard } from '../components/WeatherCard';
import { useTheme } from '../contexts/ThemeContext';
import { useChatStore } from '../store/useChatStore';

interface HomePageProps {
  onSendMessage: (message: string) => Promise<void>;
}

export const HomePage: React.FC<HomePageProps> = ({ onSendMessage }) => {
  const { isDark, toggleTheme } = useTheme();
  const { weatherData } = useChatStore();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      
      {weatherData && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <WeatherCard weather={weatherData} />
        </div>
      )}
      
      <ChatWindow />
      <ChatInput onSend={onSendMessage} />
    </div>
  );
};
