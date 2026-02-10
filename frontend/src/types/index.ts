export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
  weather?: WeatherData;
}
