const redis = require('redis')

const redisClient = redis.createClient(
  process.env.REDISPORT || 6379,
  process.env.REDISHOST || 'localhost'
)

redisClient.on('connect', () => console.log('Redis connected'))
redisClient.on('error', (err) => console.log(err))

module.exports = redisClient
