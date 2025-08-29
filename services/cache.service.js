// services/cache.service.js
const Redis = require('ioredis');

let redis = null;
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
  redis.on('connect', () => console.log('✅ Connected to Redis'));
  redis.on('error', (err) => console.error('❌ Redis error', err));
}

// In-memory fallback
const memoryCache = new Map();

/**
 * Set cache
 * @param {string} key 
 * @param {*} value 
 * @param {number} ttl - time to live in seconds
 */
async function setCache(key, value, ttl = 60) {
  if (redis) {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  } else {
    memoryCache.set(key, { value, expires: Date.now() + ttl * 1000 });
  }
}

/**
 * Get cache
 * @param {string} key 
 * @returns {*}
 */
async function getCache(key) {
  if (redis) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } else {
    const cache = memoryCache.get(key);
    if (!cache) return null;
    if (Date.now() > cache.expires) {
      memoryCache.delete(key);
      return null;
    }
    return cache.value;
  }
}

/**
 * Delete cache
 * @param {string} key 
 */
async function delCache(key) {
  if (redis) {
    await redis.del(key);
  } else {
    memoryCache.delete(key);
  }
}

/**
 * Clear all cache
 */
async function clearCache() {
  if (redis) {
    await redis.flushall();
  } else {
    memoryCache.clear();
  }
}

module.exports = {
  setCache,
  getCache,
  delCache,
  clearCache
};
