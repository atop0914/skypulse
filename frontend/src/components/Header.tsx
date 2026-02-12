import React from 'react';

interface HeaderProps {
  onToggleTheme: () => void;
  isDark: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleTheme, isDark }) => {
  return (
    <header className="header-glass">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-100/50 via-blue-50/50 to-indigo-100/50 dark:from-gray-800/50 dark:via-slate-800/50 dark:to-indigo-900/50" />
      
      <div className="relative max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo section */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
              <span className="text-2xl filter drop-shadow-lg animate-float">🌤️</span>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 blur-lg opacity-50 animate-pulse-glow" />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent aurora-text">
              SkyPulse
            </h1>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              智能天气助手
            </span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100/50 dark:bg-green-900/30 border border-green-200/50 dark:border-green-700/30">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">在线</span>
          </div>

          {/* Theme toggle button */}
          <button
            onClick={onToggleTheme}
            className="relative group p-3 rounded-xl bg-white/60 dark:bg-gray-700/60 backdrop-blur-lg border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            aria-label="切换主题"
          >
            {/* Background glow on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Sun icon (dark mode) */}
            <span className={`absolute inset-0 flex items-center justify-center text-xl transition-all duration-300 ${isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
              ☀️
            </span>
            
            {/* Moon icon (light mode) */}
            <span className={`absolute inset-0 flex items-center justify-center text-xl transition-all duration-300 ${isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
              🌙
            </span>
          </button>
        </div>
      </div>
      
      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/50 dark:via-gray-600/50 to-transparent" />
    </header>
  );
};
