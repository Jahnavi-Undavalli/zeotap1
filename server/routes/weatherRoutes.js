const express = require('express');
const { getWeatherSummary } = require('../controllers/weatherController');
const router = express.Router();

router.get('/', getWeatherSummary);

module.exports = router;
