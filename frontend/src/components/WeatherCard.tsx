import React from 'react';
import type { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white mb-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{weather.location}</h3>
          <p className="text-4xl font-bold mt-1">{weather.temperature}°C</p>
          <p className="text-blue-100">{weather.condition}</p>
        </div>
        <div className="text-6xl">
          {weather.condition.includes('雨') ? '🌧️' : 
           weather.condition.includes('云') ? '☁️' : 
           weather.condition.includes('晴') ? '☀️' : '🌤️'}
        </div>
      </div>
      
      <div className="flex gap-4 text-sm text-blue-100">
        <span>💧 湿度: {weather.humidity}%</span>
        <span>💨 风速: {weather.windSpeed} km/h</span>
      </div>
      
      {weather.forecast && weather.forecast.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-blue-100 mb-2">7天预报</p>
          <div className="flex gap-2 overflow-x-auto">
            {weather.forecast.slice(0, 7).map((day, index) => (
              <div key={index} className="flex-shrink-0 text-center bg-white/10 rounded-lg px-3 py-2">
                <p className="text-xs">{day.date.slice(5)}</p>
                <p className="font-semibold">{day.tempHigh}°</p>
                <p className="text-xs text-blue-200">{day.tempLow}°</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
