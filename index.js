const Pull = require('./app/modules/pull');
const Push = require('./app/modules/push');
const Notifier = require('./app/modules/notifier');
const redisClient = require('./app/modules/redis');
const Message = require('./app/modules/Message');

const minimist = require('minimist');
/*
 * Get errors.
 */
const argv = minimist(process.argv.slice(2));
if (argv._.includes('getErrors')) return getErrors();


/**
 * Create get errors function
 * @Pull { queue, redisClient, onTimeout, timeout }
 * Listen data and show it in conole
 * @return { Pull }
 */

function getErrors() {
  let errors = new Pull('errors', redisClient(), () => errors.end(), 500);
  errors.on("data", data => console.log(data));
  return errors;
}

let worker = createWorker(); //Start worker

function createWorker() {
  let errors = new Push('errors', redisClient());
  let worker = new Pull('messages', redisClient(), () => {
    Notifier.publish('idleTimeout', true);
  }, 500);

  worker.on("data", (data) => {
    eventHandler(data, (error, data) => {
      if (error) {
        console.log('Error message', data);
        return errors.write(data);
      }
      console.log('Normal message', data);
    })
  });

  return worker;
}

/**
 * Create generator, which push messages in Redis
 * 
 */

function createGenerator() {
  let client = redisClient();
  let generator = new Push('messages', redisClient());

  (function next() {
    let message = Message.getMessage();
    generator.write(message);
    client.llen('messages', ( _, length) => {
      if (length > 1000){
        return Notifier.publish('idleTimeout', true);
      }  
      next();
    });
  })();
  return generator;
}

/**
 * Create state-machine function,
 * which choose what worker we create
 * 
 * @return { Function }
 */

Notifier.subscribe('idleTimeout', function () {
  worker.end();
  if (worker instanceof Push) return worker = createWorker();
  if (worker instanceof Pull) return worker = createGenerator();
});

/**
 * Standart function from original text
 * C&P programming style
 * 
 * @param { String } msg 
 * @param { Function } callback 
 */

function eventHandler(msg, callback) {
  function onComplete() {
    let error = Math.random() > 0.95;
    callback(error, msg);
  }
  setTimeout(onComplete, 1000);
}






