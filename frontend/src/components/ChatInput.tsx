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

  const handleQuickQuestion = (question: string) => {
    if (!isLoading) {
      setInput(question);
    }
  };

  const quickQuestions = [
    { icon: '☀️', label: '北京' },
    { icon: '🌆', label: '上海' },
    { icon: '🌡️', label: '广州' },
    { icon: '🌴', label: '深圳' },
  ];

  const suggestedQuestions = ['今天适合出门吗？', '明天会下雨吗？', '周末天气怎么样？'];

  return (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border-t border-gray-200/30 dark:border-gray-700/30 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Suggested questions */}
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedQuestions.map((q, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(q)}
              disabled={isLoading}
              className="quick-btn group px-3 py-1.5 text-sm bg-gradient-to-r from-sky-100/80 to-blue-100/80 dark:from-sky-900/40 dark:to-blue-900/40 rounded-full border border-sky-200/50 dark:border-sky-700/50 text-sky-700 dark:text-sky-300 hover:from-sky-200/80 hover:to-blue-200/80 dark:hover:from-sky-800/50 dark:hover:to-blue-800/50 transition-all duration-300 disabled:opacity-50"
            >
              <span className="flex items-center gap-1.5">
                <span className="group-hover:scale-110 transition-transform duration-300">💬</span>
                {q}
              </span>
            </button>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center gap-3">
            {/* Quick location buttons */}
            <div className="hidden sm:flex items-center gap-1.5">
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickQuestion(`${q.label}天气怎么样？`)}
                  disabled={isLoading}
                  className="w-10 h-10 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center text-lg hover:scale-110 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 shadow-sm"
                  title={`询问${q.label}天气`}
                >
                  <span className="animate-bounce-subtle">{q.icon}</span>
                </button>
              ))}
            </div>

            {/* Input field */}
            <div className="flex-1 relative input-glow">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入您想了解的天气问题..."
                disabled={isLoading}
                className="w-full px-5 py-3.5 pr-14 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 shadow-inner"
              />
              
              {/* Character counter or status */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {input.length > 0 && (
                  <span className="text-xs text-gray-400">{input.length}/200</span>
                )}
              </div>
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="relative group p-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-2xl shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              {/* Button icon */}
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </span>
              
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isLoading ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </span>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </button>
          </div>
        </form>

        {/* Footer hint */}
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            💡 提示：可以询问任意地点的天气情况，包括温度、湿度、降雨概率等
          </p>
        </div>
      </div>
    </div>
  );
};
