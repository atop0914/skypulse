import React from 'react';

interface HeaderProps {
  onToggleTheme: () => void;
  isDark: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleTheme, isDark }) => {
  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌤️</span>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            SkyPulse
          </h1>
        </div>
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};
