const redis = require('redis');

/**
 * Create client to DB
 * @return { RedisClient }
 */
function redisClient () {
  let options = {
    host    : 'localhost',
    port    : 6379,
    cache   : true
  };

  let client = redis.createClient(options.port, options.host);
  if (options.database) client.select(options.database);

  return client;
};

module.exports = redisClient;