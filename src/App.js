import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState('London');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      const today = new Date();
      const nextSevenDays = Array.from({length: 7}, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date.toISOString().split('T')[0];
      });

      const promises = nextSevenDays.map(date => 
        fetch(`https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=1&dt=${date}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-key': 'a382e22ad3msh2f0df04d804dc4fp123f1bjsn740c0d9b024a',
            'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
          }
        }).then(res => res.json())
      );

      const results = await Promise.all(promises);
      setWeatherData(results);
    };

    fetchWeatherData();
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCity(searchInput);
    setSearchInput('');
  };

  if (weatherData.length === 0) return <div>Loading...</div>;

  const todayData = weatherData[0];
  const todayHourlyForecast = todayData.forecast.forecastday[0].hour.filter((_, index) => index % 3 === 0);

  return (
    <div className="App">
      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          value={searchInput} 
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for a city"
        />
        <button type="submit">Search</button>
      </form>
      <div className="current-weather">
  <div className="weather-details">
    <h2>{todayData.location.name}</h2>
    <p>Chance of Rain: {Math.floor(todayData.forecast.forecastday[0].day.daily_chance_of_rain)}%</p>
    <p className="current-temp">{Math.floor(todayData.current.temp_c)}°C</p>
  </div>
  <div className="weather-icon-container">
    <img src={todayData.current.condition.icon} alt={todayData.current.condition.text} className="current-icon" />
  </div>
</div>
<div className="today-forecast">
  <h3>Today's Forecast</h3>
  <div className="hourly-forecast">
    {todayHourlyForecast.map((hour, index) => (
      <div key={index} className="hourly-item">
        <p>{new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}</p>
        <img src={hour.condition.icon} alt={hour.condition.text} />
        <p>{Math.floor(hour.temp_c)}°C</p>
      </div>
    ))}
  </div>
  <button className="view-more">View More</button>
</div>
      <div className="seven-day-forecast">
        <h3>7-Day Forecast</h3>
        <div className="forecast-card">
          {weatherData.map((day, index) => (
            <div key={day.forecast.forecastday[0].date} className="forecast-row">
              <span className="day-name">
                {index === 0 ? 'Today' : new Date(day.forecast.forecastday[0].date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <img src={day.forecast.forecastday[0].day.condition.icon} alt={day.forecast.forecastday[0].day.condition.text} />
              <span className="condition">{day.forecast.forecastday[0].day.condition.text}</span>
              <span className="temp-range">
                {Math.round(day.forecast.forecastday[0].day.mintemp_c)}° / {Math.round(day.forecast.forecastday[0].day.maxtemp_c)}° 
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;