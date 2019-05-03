/**
 * Create Messages with Factory method
 * 
 * @return { Number }
 */

class Message {
  constructor(){
    this.count = 1;
  }
  getMessage(){
    return this.count++;
  }
}

module.exports = new Message();
