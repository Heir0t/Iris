interface WeatherData {
  temperature: number;
  humidity: number;
  light: number;
  windSpeed: number;
  precipitation: number;
  pressure: number;
  uvIndex: number;
  condition: string;
  icon: string;
}

interface ForecastDay {
  date: string;
  dayName: string;
  minTemp: number;
  maxTemp: number;
  condition: string;
  icon: string;
  precipitation: number;
}

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';


// Mapeia ícones do OpenWeather para emojis
const getWeatherEmoji = (iconCode: string): string => {
  const emojiMap: { [key: string]: string } = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '🌨️',
    '13n': '🌨️',
    '50d': '🌫️',
    '50n': '🌫️',
  };
  return emojiMap[iconCode] || '☀️';
};

const translateCondition = (description: string): string => {
  const translations: { [key: string]: string } = {
    'clear sky': 'Céu Limpo',
    'few clouds': 'Parcialmente Nublado',
    'scattered clouds': 'Nuvens Dispersas',
    'broken clouds': 'Nublado',
    'overcast clouds': 'Muito Nublado',
    'shower rain': 'Chuva Leve',
    'rain': 'Chuva',
    'light rain': 'Chuva Leve',
    'moderate rain': 'Chuva Moderada',
    'heavy intensity rain': 'Chuva Forte',
    'thunderstorm': 'Tempestade',
    'snow': 'Neve',
    'mist': 'Névoa',
    'fog': 'Neblina',
  };
  return translations[description.toLowerCase()] || description;
};

export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  try {
    // Busca dados climáticos atuais
    const currentResponse = await fetch(
      `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
    );

    if (!currentResponse.ok) {
      throw new Error('Erro ao buscar dados climáticos');
    }

    const currentData = await currentResponse.json();

    const now = new Date();
    const hour = now.getHours();
    const cloudCover = currentData.clouds?.all || 0;
    let uvIndex = 0;

    if (hour >= 10 && hour <= 16) {
      const uvIntensity = Math.sin((hour - 10) * Math.PI / 6) * 11;
      uvIndex = Math.round(uvIntensity * (1 - cloudCover / 150));
    }

    let light = 0;
    if (hour >= 6 && hour <= 18) {
      const sunIntensity = Math.sin((hour - 6) * Math.PI / 12) * 100;
      light = Math.round(sunIntensity * (1 - cloudCover / 100));
    }

    const precipitation = currentData.rain?.['3h'] || currentData.rain?.['1h'] || 0;

    return {
      temperature: Math.round(currentData.main.temp),
      humidity: currentData.main.humidity,
      light: Math.max(0, Math.min(100, light)),
      windSpeed: Math.round(currentData.wind.speed * 3.6), 
      precipitation: Math.round(precipitation),
      pressure: currentData.main.pressure,
      uvIndex: Math.max(0, Math.min(11, uvIndex)),
      condition: translateCondition(currentData.weather[0].description),
      icon: getWeatherEmoji(currentData.weather[0].icon),
    };
  } catch (error) {
    console.error('Erro ao buscar dados do OpenWeather:', error);
    throw error;
  }
};

export const fetchWeatherForecast = async (
  latitude: number,
  longitude: number
): Promise<ForecastDay[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar previsão do tempo');
    }

    const data = await response.json();
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const forecast: ForecastDay[] = [];

    const dailyData: { [key: string]: any[] } = {};

    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = [];
      }
      dailyData[dateKey].push(item);
    });

    const dates = Object.keys(dailyData).slice(0, 7);

    dates.forEach((dateKey, index) => {
      const dayData = dailyData[dateKey];
      const date = new Date(dayData[0].dt * 1000);

      const temps = dayData.map((d: any) => d.main.temp);
      const minTemp = Math.round(Math.min(...temps));
      const maxTemp = Math.round(Math.max(...temps));

      const middayData = dayData.reduce((prev, curr) => {
        const prevHour = new Date(prev.dt * 1000).getHours();
        const currHour = new Date(curr.dt * 1000).getHours();
        return Math.abs(currHour - 12) < Math.abs(prevHour - 12) ? curr : prev;
      });

      const precipitation = dayData.reduce((sum: number, d: any) => {
        return sum + (d.rain?.['3h'] || 0);
      }, 0);

      const dayName = index === 0 ? 'Hoje' : dayNames[date.getDay()];

      forecast.push({
        date: dateKey,
        dayName,
        minTemp,
        maxTemp,
        condition: translateCondition(middayData.weather[0].description),
        icon: getWeatherEmoji(middayData.weather[0].icon),
        precipitation: Math.round(precipitation),
      });
    });

    return forecast;
  } catch (error) {
    console.error('Erro ao buscar previsão do OpenWeather:', error);
    throw error;
  }
};

export const getWeatherAlerts = (weather: WeatherData): string[] => {
  const alerts: string[] = [];

  if (weather.temperature > 32) {
    alerts.push("🌡️ Alerta de calor - Aumente a irrigação");
  }

  if (weather.temperature < 10) {
    alerts.push("❄️ Alerta de frio - Proteja culturas sensíveis");
  }

  if (weather.precipitation > 20) {
    alerts.push("🌧️ Chuva forte prevista - Verifique drenagem");
  }

  if (weather.windSpeed > 40) {
    alerts.push("💨 Vento forte - Proteja estruturas");
  }

  if (weather.uvIndex > 8) {
    alerts.push("☀️ UV alto - Proteja trabalhadores");
  }

  if (alerts.length === 0) {
    alerts.push("✅ Sem alertas climáticos");
  }

  return alerts;
};