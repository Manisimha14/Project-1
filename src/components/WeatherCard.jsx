import React from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  CloudLightning, 
  CloudSnow, 
  CloudFog,
  Moon
} from 'lucide-react';

const WeatherCard = ({ data, unit }) => {
  const { name, main, weather, wind } = data;
  const iconId = weather[0].icon;
  
  // Convert temperature if needed
  const getTemp = (t) => {
    if (unit === 'F') {
      return Math.round((t * 9) / 5 + 32);
    }
    return Math.round(t);
  };

  // Map Visual Crossing Icon IDs to Lucide Icons
  const getIcon = (id) => {
    const iconClass = "w-16 h-16 text-white";
    switch (id) {
      case 'snow':
      case 'snow-showers-day':
      case 'snow-showers-night':
        return <CloudSnow className={`${iconClass} text-blue-100`} />;
      case 'thunder-rain':
      case 'thunder-showers-day':
      case 'thunder-showers-night':
        return <CloudLightning className={`${iconClass} text-yellow-500`} />;
      case 'rain':
      case 'showers-day':
      case 'showers-night':
        return <CloudRain className={`${iconClass} text-blue-400`} />;
      case 'fog':
        return <CloudFog className={`${iconClass} text-gray-300`} />;
      case 'wind':
        return <Wind className={`${iconClass} text-gray-200`} />;
      case 'cloudy':
      case 'partly-cloudy-day':
      case 'partly-cloudy-night':
        return <Cloud className={`${iconClass} text-gray-200`} />;
      case 'clear-day':
        return <Sun className={`${iconClass} text-yellow-400`} />;
      case 'clear-night':
        return <Moon className={`${iconClass} text-gray-100`} />;
      default:
        return <Cloud className={iconClass} />;
    }
  };

  // Dynamic Background based on iconId
  const getBgClass = (id) => {
    if (id.includes('rain') || id.includes('showers')) return 'weather-gradient-rainy';
    if (id.includes('clear')) return 'weather-gradient-clear';
    if (id.includes('cloudy')) return 'weather-gradient-cloudy';
    if (id.includes('sun')) return 'weather-gradient-sunny';
    return '';
  };

  return (
    <div className={`glass-card w-full max-w-md mx-auto fade-in mt-8 ${getBgClass(iconId)}`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold drop-shadow-md">{name}</h2>
          <p className="text-white/80 capitalize drop-shadow-sm">{weather[0].description}</p>
        </div>
        <div className="bg-black/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
          {getIcon(iconId)}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center">
        <span className="text-8xl font-black drop-shadow-xl">{getTemp(main.temp)}°</span>
        <span className="text-4xl font-light mb-auto mt-2 ml-2 drop-shadow-md">{unit}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-black/10 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-3 border border-white/5">
          <div className="bg-blue-500/30 p-2 rounded-lg">
            <Droplets className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Humidity</p>
            <p className="font-semibold">{main.humidity}%</p>
          </div>
        </div>
        
        <div className="bg-black/10 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-3 border border-white/5">
          <div className="bg-green-500/30 p-2 rounded-lg">
            <Wind className="w-5 h-5 text-green-200" />
          </div>
          <div>
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Wind Speed</p>
            <p className="font-semibold">{wind.speed} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
