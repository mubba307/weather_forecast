'use client';

import React, { useState } from "react";
import axios from "axios";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Weather = () => {
  const [location, setLocation] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  const API_KEY = "c27726aa459d1570f26b2f8dd95f3b64";

  const getWeather = async () => {
    const sanitizedLocation = location.trim();
    if (!sanitizedLocation) {
      setError("Please enter a location");
      setCurrentWeather(null);
      setForecast([]);
      return;
    }

    try {
      const currentRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${sanitizedLocation}&appid=${API_KEY}&units=metric`
      );
      setCurrentWeather(currentRes.data);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${sanitizedLocation}&appid=${API_KEY}&units=metric`
      );

      const dailyForecast = forecastRes.data.list.filter((entry) =>
        entry.dt_txt.includes("00:00:00")
      );

      setForecast(dailyForecast);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Location not found or error fetching data");
      setCurrentWeather(null);
      setForecast([]);
    }
  };

  const getBackground = () => {
    if (!currentWeather) return "default";
    const weather = currentWeather.weather[0].main.toLowerCase();
    if (weather.includes("cloud")) return "cloudy";
    if (weather.includes("rain") || weather.includes("drizzle")) return "rainy";
    if (weather.includes("clear")) return "sunny";
    if (weather.includes("snow")) return "snowy";
    return "default";
  };

  const backgroundImages = {
    sunny: "url('https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=2100&q=80')",
    cloudy: "url('https://images.unsplash.com/photo-1502784444185-165e002e0b4e?auto=format&fit=crop&w=2100&q=80')",
    rainy: "url('https://images.unsplash.com/photo-1534081333815-ae5019106621?auto=format&fit=crop&w=2100&q=80')",
    snowy: "url('https://images.unsplash.com/photo-1608889179153-3e4b1fbe2c20?auto=format&fit=crop&w=2100&q=80')",
    default: "linear-gradient(120deg, #667eea, #764ba2)",
  };

  const backgroundStyle = {
    backgroundImage: backgroundImages[getBackground()],
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "background 0.6s ease",
    minHeight: "100vh",
    color: "white",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  };

  return (
    <div style={backgroundStyle}>
      <div style={{ backdropFilter: "blur(4px)" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "20px" }}>
          🌦 Real-Time Weather + 5-Day Forecast
        </h2>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city"
            style={{
              padding: "12px",
              width: "60%",
              maxWidth: "400px",
              borderRadius: "12px",
              border: "none",
              marginRight: "10px",
            }}
          />
          <button
            onClick={getWeather}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              backgroundColor: "#ffffff30",
              color: "black",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(6px)",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        {error && <p style={{ color: "salmon", textAlign: "center" }}>{error}</p>}

        {currentWeather && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              borderRadius: "15px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
              textAlign: "center",
              maxWidth: "600px",
              margin: "20px auto",
            }}
          >
            <h3 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
              {currentWeather.name}, {currentWeather.sys.country}
            </h3>
            <img
              src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
              alt="weather icon"
              style={{
                width: "100px",
                height: "100px",
                filter: "drop-shadow(0 0 10px white)",
              }}
            />
            <p style={{ fontSize: "1.2rem" }}><strong>🌡 Temp:</strong> {currentWeather.main.temp}°C</p>
            <p><strong>🌥 Condition:</strong> {currentWeather.weather[0].description}</p>
            <p><strong>💧 Humidity:</strong> {currentWeather.main.humidity}%</p>
            <p><strong>💨 Wind Speed:</strong> {currentWeather.wind.speed} m/s</p>
          </div>
        )}

        {forecast.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <h3 style={{ textAlign: "center", marginBottom: "20px", fontSize: "1.5rem" }}>📅 5-Day Forecast</h3>
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {forecast.map((day, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: "12px",
                    padding: "15px",
                    width: "200px",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    color: "#fff",
                  }}
                >
                  <p><strong>{new Date(day.dt_txt).toLocaleDateString()}</strong></p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                    style={{
                      width: "80px",
                      height: "80px",
                      filter: "drop-shadow(0 0 8px white)",
                    }}
                  />
                  <p style={{ fontSize: "1rem" }}>{day.main.temp}°C</p>
                  <p style={{ fontSize: "12px" }}>{day.weather[0].main}</p>
                </div>
              ))}
            </div>

            {/* Temperature Graph */}
            <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "15px", backdropFilter: "blur(10px)" }}>
              <h3 style={{ textAlign: "center", color: "#fff" }}>📈 Temperature Trend</h3>
              <Line
                data={{
                  labels: forecast.map(day => new Date(day.dt_txt).toLocaleDateString()),
                  datasets: [
                    {
                      label: 'Temperature (°C)',
                      data: forecast.map(day => day.main.temp),
                      fill: false,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderColor: 'rgba(255, 255, 255, 0.7)',
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: { color: '#fff' },
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: '#fff' },
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    },
                    y: {
                      ticks: { color: '#fff' },
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
