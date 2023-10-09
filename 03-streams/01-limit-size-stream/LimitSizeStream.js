const stream = require('node:stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.size = 0;
  }

  _transform(data, encoding, callback) {
    this.size += data.length;
    const error = this.size > this.limit ? new LimitExceededError() : null;

    callback(error, data);
  }
}

module.exports = LimitSizeStream;
