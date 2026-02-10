import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { MessageBubble } from './MessageBubble';

export const ChatWindow: React.FC = () => {
  const { messages, weatherData } = useChatStore();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <span className="text-6xl mb-4">🌤️</span>
          <p className="text-lg">有什么天气问题想问的吗？</p>
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {['北京天气', '上海天气', '今天下雨吗', '广州温度'].map((q) => (
              <button
                key={q}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};
