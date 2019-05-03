const { EventEmitter } = require('events');
const { inherits }     = require("util");

/**
 * create singleton Notifier 
 * 
 */
class Notifier {
  constructor(){
    EventEmitter.call(this);
  }
  subscribe(topic, callback) {
    this.on(topic, callback);
  }
  publish() {
    this.emit.apply(this, arguments);
  }
};

inherits(Notifier, EventEmitter);

module.exports = new Notifier();

