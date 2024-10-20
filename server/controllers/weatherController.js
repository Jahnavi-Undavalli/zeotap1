const Weather = require('../models/Weather');

const getWeatherSummary = async (req, res) => {
    try {
        const summaries = await Weather.find({});
        res.json(summaries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWeatherSummary };
