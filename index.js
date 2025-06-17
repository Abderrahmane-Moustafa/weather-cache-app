// Load environment variables
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const Redis = require('ioredis');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Azure Redis with TLS (required by Azure)
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  tls: {} // Enable secure connection
});

// Main route: Get weather by lat,lon (e.g., ?city=52.52,13.41)
app.get('/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City is required (format: lat,lon)' });

  const cacheKey = `weather:${city.toLowerCase()}`;

  try {
    // Check if data exists in Redis
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Data for ${city} served from cache`);
      return res.json(JSON.parse(cached));
    }

    // If not cached → fetch from API
    const { METEO_USERNAME, METEO_PASSWORD } = process.env;
    const url = `https://${METEO_USERNAME}:${METEO_PASSWORD}@api.meteomatics.com/now/t_2m:C/${city}/json`;
    const { data } = await axios.get(url);

    // Store in Redis with 1-hour expiration
    await redis.set(cacheKey, JSON.stringify(data), 'EX', 3600);

    console.log(`Data for ${city} fetched from API and cached successfully`);
    res.json(data); // Return fresh data
  } catch (err) {
    console.error(`Failed to fetch data for ${city}:`, err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
