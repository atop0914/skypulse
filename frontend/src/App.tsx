import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { HomePage } from './pages/HomePage';
import { useChatStore } from './store/useChatStore';
import { chatApi } from './services/api';

const App: React.FC = () => {
  const { addMessage, setLoading, setWeatherData } = useChatStore();

  const handleSendMessage = async (message: string) => {
    addMessage('user', message);
    setLoading(true);
    
    try {
      const response = await chatApi.sendMessage(message);
      addMessage('assistant', response.reply);
      if (response.weather) {
        setWeatherData(response.weather);
      }
    } catch (error) {
      addMessage('assistant', '抱歉，遇到了一些问题。请稍后再试。');
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <HomePage onSendMessage={handleSendMessage} />
    </ThemeProvider>
  );
};

export default App;
