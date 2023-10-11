const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.prevChunk = '';
  }

  _transform(chunk, encoding, callback) {
    this.prevChunk += chunk;

    if (this.prevChunk.indexOf(os.EOL) === -1) {
      callback();
    } else {
      const arrChunk = this.prevChunk.split(os.EOL);

      if (arrChunk.length > 2) {
        for (const ch of arrChunk) {
          this.push(ch);
        }
        callback();
      } else {
        this.prevChunk = arrChunk.at(-1);
        callback(null, arrChunk[0]);
      }
    }
  }

  _flush(callback) {
    if (this.prevChunk.indexOf(os.EOL) >= 0) {
      callback();
    } else {
      callback(null, this.prevChunk);
    }
  }
}

module.exports = LineSplitStream;
