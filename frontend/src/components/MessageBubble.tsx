import React from 'react';
import { formatTime } from '../utils/formatters';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-md'
            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-md'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <span className={`text-xs mt-1 block ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};
