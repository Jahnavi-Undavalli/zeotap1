import axios from 'axios';

const API_KEY = "2e4e47cde9dd5bb0ec383148a140a1d2"; // Set your API key in .env file
const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

export const fetchWeatherData = async (setWeatherData, setAlerts) => {
    const newAlerts = [];
    const fetchedData = [];

    for (const city of CITIES) {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = response.data;
        fetchedData.push({
            dt: data.dt,
            main: data.weather[0].main,
            temp: data.main.temp,
            feels_like: data.main.feels_like,
        });

        // Check alert conditions
        if (data.main.temp > 35) {
            newAlerts.push(`Alert: Temperature in ${city} exceeds 35 °C.`);
        }
    }

    setWeatherData(fetchedData);
    setAlerts(newAlerts);
};
