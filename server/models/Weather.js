const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    avgTemp: { type: Number, required: true },
    maxTemp: { type: Number, required: true },
    minTemp: { type: Number, required: true },
    dominantCondition: { type: String, required: true },
});

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
