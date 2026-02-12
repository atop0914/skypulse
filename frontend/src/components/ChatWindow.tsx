import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { MessageBubble } from './MessageBubble';

export const ChatWindow: React.FC = () => {
  const { messages } = useChatStore();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = [
    { icon: '☀️', text: '北京天气' },
    { icon: '🌆', text: '上海天气' },
    { icon: '🌧️', text: '今天下雨吗' },
    { icon: '🌡️', text: '广州温度' },
    { icon: '❄️', text: '哈尔滨冷不冷' },
    { icon: '🌴', text: '三亚适合去吗' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sky-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-48 h-48 bg-blue-300/10 rounded-full blur-3xl" />
      </div>

      {messages.length === 0 ? (
        <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[400px]">
          {/* Animated main icon */}
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-pulse-glow">
              <span className="text-6xl filter drop-shadow-lg animate-float">🌤️</span>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg animate-bounce-subtle text-lg">
              ☀️
            </div>
            <div className="absolute -bottom-3 -left-3 w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg animate-bounce-subtle text-xl" style={{ animationDelay: '0.5s' }}>
              ☁️
            </div>
          </div>

          {/* Welcome text */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
              有什么可以帮您？
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              随时询问天气情况，我来为您解答
            </p>
          </div>

          {/* Quick questions grid */}
          <div className="w-full max-w-md">
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 text-center font-medium">
              💡 试试这样问
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  className="group relative p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 overflow-hidden quick-btn"
                >
                  <div className="relative flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {q.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {q.text}
                    </span>
                  </div>
                  
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-full border border-gray-200/30 dark:border-gray-700/30">
              <span className="text-lg">🔔</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">实时天气</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-full border border-gray-200/30 dark:border-gray-700/30">
              <span className="text-lg">📊</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">7天预报</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-full border border-gray-200/30 dark:border-gray-700/30">
              <span className="text-lg">⚡</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">智能响应</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};
