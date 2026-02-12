import React from 'react';
import { formatTime } from '../utils/formatters';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-slide-up`}>
      <div
        className={`max-w-[75%] sm:max-w-[65%] ${
          isUser
            ? 'message-bubble-user'
            : 'message-bubble-assistant'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
            isUser 
              ? 'bg-white/20' 
              : 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600'
          }`}>
            {isUser ? (
              <span className="text-sm">👤</span>
            ) : (
              <span className="text-sm animate-float">🌤️</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm font-medium ${isUser ? 'text-white/90' : 'text-gray-700 dark:text-gray-200'}`}>
                {isUser ? '你' : 'SkyPulse'}
              </span>
              <span className={`text-xs ${isUser ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`}>
                {formatTime(message.timestamp)}
              </span>
            </div>
            
            <p className={`whitespace-pre-wrap leading-relaxed ${isUser ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
              {message.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Typing indicator component for loading state
export const TypingIndicator: React.FC = () => (
  <div className="flex justify-start mb-4 animate-slide-up">
    <div className="message-bubble-assistant">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <span className="text-sm animate-float">🌤️</span>
        </div>

        {/* Typing animation */}
        <div className="flex items-center gap-1 py-2">
          <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  </div>
);
