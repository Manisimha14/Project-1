import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader2, AlertCircle, CloudSun } from 'lucide-react';
import WeatherCard from './components/WeatherCard';
import SearchHistory from './components/SearchHistory';

// --- CONFIGURATION ---
// Visual Crossing API Configuration
const API_KEY = 'SGDBZWBQDRYE5HSDQXPD4Y26J';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C'); // 'C' for Metric, 'F' for US units
  const [history, setHistory] = useState([]);

  // Load history from Local Storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherSearchHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Update Local Storage whenever history changes
  useEffect(() => {
    localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
  }, [history]);

  const fetchWeather = async (searchCity) => {
    if (!searchCity || searchCity.trim() === '') return;
    
    setLoading(true);
    setError(null);
    
    // Visual Crossing uses 'metric' for Celsius and 'us' for Fahrenheit
    const unitGroup = unit === 'C' ? 'metric' : 'us';

    try {
      const response = await axios.get(`${BASE_URL}/${encodeURIComponent(searchCity)}`, {
        params: {
          key: API_KEY,
          unitGroup: 'metric', // We fetch in Metric and handle conversion or re-fetch
          include: 'current', // Only current weather for simplicity as per requirements
          contentType: 'json'
        },
      });

      // Visual Crossing returns data in currentConditions
      const data = {
        name: response.data.resolvedAddress,
        main: {
          temp: response.data.currentConditions.temp,
          humidity: response.data.currentConditions.humidity
        },
        wind: {
          speed: response.data.currentConditions.windspeed
        },
        weather: [{
          main: response.data.currentConditions.conditions,
          description: response.data.currentConditions.conditions,
          icon: response.data.currentConditions.icon
        }]
      };

      setWeatherData(data);
      
      // Update History: Add only if not already there, keep last 5
      setHistory(prev => {
        const filtered = prev.filter(c => c.toLowerCase() !== searchCity.toLowerCase());
        return [searchCity, ...filtered].slice(0, 5);
      });
      
      setCity(''); // Clear input
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setError('City not found or invalid request. Please check the name.');
      } else if (err.response && err.response.status === 401) {
        setError('API Key error. Please verify your Visual Crossing key.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const toggleUnit = () => {
    setUnit(prev => (prev === 'C' ? 'F' : 'C'));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('weatherSearchHistory');
  };

  return (
    <div className="min-h-screen px-4 py-12 md:py-20 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center items-center gap-3 mb-2">
          <CloudSun className="w-10 h-10 text-blue-400" />
          <h1 className="text-4xl font-black tracking-tight">SkyCast</h1>
        </div>
        <p className="text-white/60">Your simple and beautiful weather checker</p>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            placeholder="Enter city name..."
            className="input-field w-full pl-12 pr-4 py-4 text-lg"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary !py-2 !px-4 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </form>

        {/* Unit Toggle */}
        <div className="flex justify-end">
          <button 
            onClick={toggleUnit}
            className="glass-card !p-2 !rounded-xl text-xs font-bold hover:bg-white/20"
          >
            Switch to {unit === 'C' ? '°F' : '°C'}
          </button>
        </div>

        {/* Message States */}
        {error && (
          <div className="glass-card border-red-500/50 bg-red-500/10 flex items-start gap-3 fade-in">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {loading && !weatherData && (
          <div className="flex flex-col items-center justify-center p-12 space-y-4 fade-in">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            <p className="text-white/50 animate-pulse">Fetching weather data...</p>
          </div>
        )}

        {/* Weather Card */}
        {weatherData && !loading && (
          <WeatherCard data={weatherData} unit={unit} />
        )}

        {/* Search History */}
        <SearchHistory 
          history={history} 
          onSelect={fetchWeather} 
          onClear={clearHistory}
        />
      </div>

      {/* Footer */}
      <div className="mt-auto pt-10 text-center">
        <p className="text-white/20 text-xs">
          Built with React • Visual Crossing API • Axios
        </p>
      </div>
    </div>
  );
}

export default App;
