import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { HomePage } from './pages/HomePage';
import { useChatStore } from './store/useChatStore';
import { chatApi } from './services/api';

const App: React.FC = () => {
  const { addMessage, appendToLastAssistantMessage, setLoading } = useChatStore();

  const handleSendMessage = async (message: string) => {
    addMessage('user', message);
    setLoading(true);

    try {
      // 添加空的 assistant 消息作为占位符
      addMessage('assistant', '');

      // 使用流式发送
      await chatApi.sendMessageStream(message, (chunk) => {
        // 逐块追加到最后一条 assistant 消息
        appendToLastAssistantMessage(chunk);
      });
    } catch (error) {
      // 如果出错，追加错误消息
      appendToLastAssistantMessage('抱歉，遇到了一些问题。请稍后再试。');
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
