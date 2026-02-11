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
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      
      {weatherData && <WeatherCard weather={weatherData} />}
      
      <ChatWindow />
      <ChatInput onSend={onSendMessage} />
    </div>
  );
};
