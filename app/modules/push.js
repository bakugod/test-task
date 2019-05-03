const { Writable } = require('stream');
const { inherits } = require('util');

/**
 * Push constructor
 *
 * @param {Object}
*/
class Push{
  constructor(queue, redisClient) {
    /*
     * Create  readable stream  outputs { Objects }
     */
    Writable.call(this, { "objectMode": true });

    this.queue = queue;
    this.redis = redisClient;
}
  /**
   * Subscribe to errors
   */
  get(){
    this.redis.on("error", (error) => {
      this.end("error", error)
    });
  }

  /**
   * Initialize default strem method
   * 
   * @param { Object } data 
   * @param { Function } next 
   */
  _write(data, e, next) {
    this.redis.rpush(this.queue, JSON.stringify(data), error => {
      if ( error ) return next(error);
      this.emit('pushed', data);
      next();
    });
  }
    
  end() {
    Push.super_.prototype.end.call(this);
    this.redis.end(false);
  };
}

inherits(Push, Writable);

module.exports = Push;