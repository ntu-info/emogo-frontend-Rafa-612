import * as Location from 'expo-location';

export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  icon: string;
}

export const getCurrentWeather = async (
  latitude: number,
  longitude: number
): Promise<WeatherData | null> => {
  try {
    // 使用 OpenWeatherMap API (需要註冊免費 API key)
    const API_KEY = 'YOUR_API_KEY'; // 可以稍後替換
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Weather API error:', response.status);
      return null;
    }

    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      icon: getWeatherEmoji(data.weather[0].main),
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

// 將天氣狀況轉換為 emoji
const getWeatherEmoji = (condition: string): string => {
  const weatherMap: { [key: string]: string } = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️',
  };
  
  return weatherMap[condition] || '🌤️';
};

// 備用方案：使用免費的 wttr.in API（無需 API key）
export const getWeatherSimple = async (
  latitude: number,
  longitude: number
): Promise<WeatherData | null> => {
  try {
    const url = `https://wttr.in/${latitude},${longitude}?format=j1`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Weather API error:', response.status);
      return null;
    }

    const data = await response.json();
    const current = data.current_condition[0];
    
    return {
      temperature: parseInt(current.temp_C),
      condition: current.weatherDesc[0].value,
      description: current.weatherDesc[0].value.toLowerCase(),
      humidity: parseInt(current.humidity),
      icon: getWeatherEmojiFromDesc(current.weatherDesc[0].value),
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

const getWeatherEmojiFromDesc = (description: string): string => {
  const desc = description.toLowerCase();
  if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
  if (desc.includes('cloud')) return '☁️';
  if (desc.includes('rain')) return '🌧️';
  if (desc.includes('storm')) return '⛈️';
  if (desc.includes('snow')) return '❄️';
  if (desc.includes('fog') || desc.includes('mist')) return '🌫️';
  return '🌤️';
};
