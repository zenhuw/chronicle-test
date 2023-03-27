import type { RedisClientType } from 'redis';
import { createClient } from 'redis';
import config from 'config';

let redisClient: RedisClientType;
let isReady: boolean;

async function getCache(): Promise<RedisClientType> {
  if (!isReady) {
    redisClient = createClient({
      url: config.get('redis.url')
    });
    redisClient.on('error', err => console.log(`Redis Error: ${err}`));
    redisClient.on('connect', () => console.log('Redis connected'));
    redisClient.on('reconnecting', () => console.log('Redis reconnecting'));
    redisClient.on('ready', () => {
      isReady = true;
      console.log('Redis ready!');
    });
    await redisClient.connect();
  }
  return redisClient;
}

getCache()
  .then(connection => {
    redisClient = connection;
  })
  .catch(err => {
    console.log({ err }, 'Failed to connect to Redis');
  });

export { getCache };
