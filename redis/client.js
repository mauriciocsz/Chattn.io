//Creates a RedisStore and client for the application

const session = require('express-session');
const redis = require('redis');
const connRedis = require('connect-redis');

const RedisStore = connRedis(session);

const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost'
})

module.exports = {RedisStore, redisClient}