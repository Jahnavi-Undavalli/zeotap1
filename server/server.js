const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const WeatherSummary = require('./weatherSummaryModel');  // Weather summary model (in separate file)
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = '2e4e47cde9dd5bb0ec383148a140a1d2';  // Replace with your OpenWeatherMap API key
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const interval = 5 * 60 * 1000;  // 5 minutes interval for data retrieval

// Connect to MongoDB
mongoose.connect('mongodb+srv://undavallijahnavi354:EqcTg6Yd8uLLx7om@cluster0.ydgg7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Utility function to convert temperature from Kelvin to Celsius
const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(2);

// Function to fetch weather data from OpenWeatherMap API
async function fetchWeatherData(city) {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,
                appid: API_KEY
            }
        });
        const weatherData = response.data;
        return {
            city: weatherData.name,
            main: weatherData.weather[0].main,
            temp: kelvinToCelsius(weatherData.main.temp),
            feels_like: kelvinToCelsius(weatherData.main.feels_like),
            dt: weatherData.dt
        };
    } catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error);
        return null;
    }
}

// Function to roll up weather data into daily summaries
async function rollupWeatherData() {
    const today = new Date().setHours(0, 0, 0, 0);  // Midnight of the current day
    const summaries = await WeatherSummary.aggregate([
        { $match: { date: today } },
        {
            $group: {
                _id: '$city',
                avgTemp: { $avg: '$temp' },
                maxTemp: { $max: '$temp' },
                minTemp: { $min: '$temp' },
                dominantCondition: { $first: '$main' }
            }
        }
    ]);

    return summaries;
}

// Function to trigger alerts based on temperature thresholds
function checkThresholds(weatherData, threshold) {
    if (weatherData.temp > threshold) {
        console.log(`Alert! Temperature in ${weatherData.city} exceeded ${threshold}°C: ${weatherData.temp}°C`);
    }
}

// API endpoint to get weather summaries
app.get('/weather-summary', async (req, res) => {
    try {
        const summaries = await WeatherSummary.find().sort({ date: -1 }).limit(7);  // Last 7 days
        res.json(summaries);
    } catch (error) {
        console.error('Error fetching weather summaries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to periodically fetch weather data and process rollups/aggregates
async function startWeatherMonitoring() {
    for (const city of cities) {
        const weatherData = await fetchWeatherData(city);
        if (weatherData) {
            const newSummary = new WeatherSummary({
                city: weatherData.city,
                main: weatherData.main,
                temp: weatherData.temp,
                feels_like: weatherData.feels_like,
                dt: weatherData.dt,
                date: new Date().setHours(0, 0, 0, 0)  // Date without time for daily rollups
            });

            await newSummary.save();

            // Check thresholds (e.g., alert if temperature exceeds 35°C)
            checkThresholds(weatherData, 35);
        }
    }
}

// Start the weather monitoring at a configured interval
setInterval(startWeatherMonitoring, interval);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
