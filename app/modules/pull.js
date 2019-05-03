const { Readable } = require('stream');
const { inherits } = require("util");

class Pull {
  constructor(queue, redisClient, onTimeout, timeout){
    /*
     * Create  readable stream  outputs { Objects }
     */
    Readable.call(this, { objectMode: true }); 

    this.queue      =     queue;
    this.redis      =     redisClient;
    this.onTimeout  =     onTimeout;
    this.timeout    =     timeout || 500;
    this.idle       =     this.timeout || 1000;
  }
  /**
   * Subscribe to errors
   */
  get(){
    this.redis.on("error", (error) => {
      this.emit("error", error)
    });
  }
  /**
   * Initialize default strem method
   * Dodge errors and other shit
   * C&P programming style
   */
  _read(){
    this.idleTimeout && clearTimeout(this.idleTimeout);
    this.idleTimeout = setTimeout(this.onTimeout, this.idle);

    process.nextTick(()=> {
      this.redis.blpop(this.queue, this.timeout, (error, response) => {
        let queue = response[0];
        let data = response[1];

        if (error) return this.emit("error", error);

        if (!response) return setImmediate(next);

        if (queue !== this.queue) return pull.emit("error", `Haven't subscribed to ${resQueue}`);

        if (!data) return setImmediate(next);

        try {
          data = JSON.parse(data)
        } catch(err) {
          return this.emit("error", err);
        }

        this.push(data);
      });
    });
  }
  end() {
    this.redis.end(false);
    this.push(null);
  }
}

inherits(Pull, Readable)

module.exports =  Pull;

