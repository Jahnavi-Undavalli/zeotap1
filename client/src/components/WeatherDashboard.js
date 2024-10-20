import React, { useEffect, useState } from 'react';
import WeatherSummary from './WeatherSummary';
import Alert from './Alert';
import { fetchWeatherData } from '../api/weatherAPI';

const WeatherDashboard = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchWeatherData(setWeatherData, setAlerts);
        }, 300000); // Fetch every 5 minutes

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>Weather Monitoring System</h1>
            {alerts.length > 0 && <Alert alerts={alerts} />}
            <WeatherSummary weatherData={weatherData} />
        </div>
    );
};

export default WeatherDashboard;
