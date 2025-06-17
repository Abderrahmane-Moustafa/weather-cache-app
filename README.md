
# Weather Data App using Azure Redis Cache

This is a simple Node.js app that gets the current weather using the Meteomatics API.  
It also uses Azure Cache for Redis to store the data for one hour so we don't have to call the API every time.

## How it works

- The user sends a request like:  
  `http://localhost:3000/weather?city=52.52,13.41` (latitude and longitude)

- The app checks if the weather data for this location is already in the Redis cache.

- If the data is cached then it returns the cached data.  
  If not then it fetches the data from Meteomatics API and stores it in the cache for 1 hour and then returns it.

## Tech used

- Node.js  
- Express  
- Axios  
- ioredis  
- dotenv  
- Azure Redis  
- Meteomatics Weather API

## How to run

1. Clone the repo and install packages:
   ```
   npm install
   ```

2. Create a `.env` file like this:

   ```
   PORT=3000
   REDIS_HOST=your_redis_host
   REDIS_PORT=6380
   REDIS_PASSWORD=your_redis_password
   METEO_USERNAME=your_meteomatics_username
   METEO_PASSWORD=your_meteomatics_password
   ```

3. Run the app:
   ```
   node index.js
   ```

4. Test it:
   ```
   http://localhost:3000/weather?city=52.52,13.41
   ```

---
## Important Note About Azure Redis Firewall

If you are using **Azure Cache for Redis**, make sure to:
- Go to the Azure Portal then Your Redis Instance then **Firewall** section.
- Add your current IP address (e.g., your laptop's public IP) to the allowed IP list.
- Otherwise, the app will not be able to connect and will show a `connect ETIMEDOUT` error.

---
## Disadvantages of caching

Caching is helpful but it can also cause some issues:

- **Speed:** if Redis is slow or down, it affects the app performance.
- **Data freshness:** weather changes quickly, so old cached data might not be accurate.
- **Costs:** Redis and API calls both cost money. Using caching helps, but Redis itself is also a paid service.
- **Security:** you need to be careful with storing API responses (maybe they have location or private info).
- **User experience:** if the user sees old or wrong data from the cache, it could confuse them.

---

That's it!
