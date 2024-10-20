import React from 'react';

const WeatherSummary = ({ weatherData }) => {
    const dailySummary = weatherData.reduce((acc, curr) => {
        const date = new Date(curr.dt * 1000).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = { temp: [], conditions: [] };
        }
        acc[date].temp.push(curr.temp);
        acc[date].conditions.push(curr.main);
        return acc;
    }, {});

    return (
        <div>
            <h2>Daily Weather Summary</h2>
            {Object.keys(dailySummary).map(date => (
                <div key={date}>
                    <h3>{date}</h3>
                    <p>Average Temperature: {average(dailySummary[date].temp)} °C</p>
                    <p>Dominant Condition: {dominantCondition(dailySummary[date].conditions)}</p>
                </div>
            ))}
        </div>
    );
};

const average = (tempArray) => {
    const sum = tempArray.reduce((a, b) => a + b, 0);
    return (sum / tempArray.length).toFixed(2);
};

const dominantCondition = (conditions) => {
    const counts = {};
    conditions.forEach(condition => {
        counts[condition] = (counts[condition] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
};

export default WeatherSummary;
