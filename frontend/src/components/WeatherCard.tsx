import React from 'react';
import type { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const getWeatherIcon = (condition: string) => {
    if (condition.includes('晴')) return '☀️';
    if (condition.includes('云') || condition.includes('阴')) return '☁️';
    if (condition.includes('雨') || condition.includes('雪')) return '🌧️';
    if (condition.includes('雷')) return '⛈️';
    if (condition.includes('雾') || condition.includes('霾')) return '🌫️';
    return '🌤️';
  };

  const getWeatherGradient = (condition: string) => {
    if (condition.includes('晴')) return 'from-amber-400 via-orange-500 to-yellow-500';
    if (condition.includes('雨') || condition.includes('雷')) return 'from-slate-600 via-blue-600 to-indigo-700';
    if (condition.includes('云') || condition.includes('阴')) return 'from-blue-400 via-sky-500 to-indigo-500';
    if (condition.includes('雪')) return 'from-cyan-300 via-blue-400 to-indigo-400';
    return 'from-sky-400 via-blue-500 to-indigo-600';
  };

  const gradientClass = getWeatherGradient(weather.condition);

  return (
    <div className="relative overflow-hidden rounded-3xl mb-4 animate-slide-up">
      {/* Main gradient background */}
      <div className={`relative bg-gradient-to-br ${gradientClass} p-6 text-white shadow-2xl shadow-blue-500/20`}>
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        
        {/* Main content */}
        <div className="relative z-10">
          {/* Location and time */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-lg animate-bounce-subtle">📍</span>
              <span className="font-medium text-lg">{weather.location}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-white/80">
              <span className="animate-pulse">●</span>
              <span>实时天气</span>
            </div>
          </div>

          {/* Temperature and condition */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-7xl font-bold tracking-tighter animate-weather-icon cursor-default">
                {weather.temperature}°
              </p>
              <p className="text-lg text-white/90 font-medium mt-1 flex items-center gap-2">
                <span className="text-2xl animate-float">{getWeatherIcon(weather.condition)}</span>
                {weather.condition}
              </p>
            </div>
            
            {/* Large weather icon */}
            <div className="relative">
              <div className="text-8xl filter drop-shadow-2xl animate-weather-icon">
                {getWeatherIcon(weather.condition)}
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
            </div>
          </div>

          {/* Weather details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-lg rounded-2xl">
              <span className="text-2xl">💧</span>
              <div>
                <p className="text-xs text-white/70">湿度</p>
                <p className="font-semibold">{weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-lg rounded-2xl">
              <span className="text-2xl">💨</span>
              <div>
                <p className="text-xs text-white/70">风速</p>
                <p className="font-semibold">{weather.windSpeed} km/h</p>
              </div>
            </div>
          </div>

          {/* 7-day forecast */}
          {weather.forecast && weather.forecast.length > 0 && (
            <div className="relative pt-4 border-t border-white/20">
              <p className="text-sm text-white/70 mb-3 font-medium">📅 7天预报</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {weather.forecast.slice(0, 7).map((day, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 flex flex-col items-center p-3 bg-white/10 backdrop-blur-lg rounded-2xl min-w-[60px] hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <span className="text-xs text-white/70">{day.date.slice(5)}</span>
                    <span className="text-xl my-1">{getWeatherIcon(day.condition || '')}</span>
                    <span className="text-sm font-semibold">{day.tempHigh}°</span>
                    <span className="text-xs text-white/60">{day.tempLow}°</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Animated weather overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {weather.condition.includes('晴') && (
            <>
              <div className="absolute top-4 right-4 w-20 h-20 bg-yellow-300/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-4 left-1/4 w-10 h-10 bg-yellow-200/30 rounded-full blur-xl animate-pulse" />
            </>
          )}
          {weather.condition.includes('云') && (
            <>
              <div className="absolute top-2 right-10 w-24 h-12 bg-white/20 rounded-full blur-xl animate-pulse-slow" />
              <div className="absolute top-8 right-20 w-16 h-8 bg-white/10 rounded-full blur-lg animate-pulse-slow" />
            </>
          )}
          {weather.condition.includes('雨') && (
            <>
              <div className="absolute top-2 right-5 w-20 h-20 bg-blue-300/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-blue-400/10 to-transparent" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
