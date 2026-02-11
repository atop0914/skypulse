import React, { useState } from 'react';
import { useChatStore } from '../store/useChatStore';

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [input, setInput] = useState('');
  const { isLoading } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    await onSend(input.trim());
    setInput('');
  };

  const quickQuestions = ['北京天气', '上海天气', '广州温度', '深圳下雨吗'];

  return (
    <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入天气相关问题..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full transition-colors font-medium"
        >
          发送
        </button>
      </form>
      
      <div className="flex gap-2 flex-wrap">
        {quickQuestions.map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
