const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const dirname = path.dirname(filepath);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad Request.');

        return;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('The path exists.');

        return;
      }

      if (!fs.existsSync(dirname)) {
        await fsPromises.mkdir(dirname);
      }

      const writeStream = fs.createWriteStream(filepath);
      const limitedStream = new LimitSizeStream({limit: 1000000}); // 1 mb

      const deleteFile = () => fs.unlink(filepath, (error) => {
      });

      req.pipe(limitedStream).pipe(writeStream);

      limitedStream.on('error', (error) => {
        deleteFile();
        res.statusCode = 413;
        res.end('File size is too large.');
      });

      req.on('aborted', () => {
        deleteFile();
        writeStream.destroy();
      });

      writeStream.on('error', (error) => {
        res.statusCode = 500;
        res.end();
      });

      writeStream.on('close', () => {
        res.statusCode = 201;
        res.end('File Uploaded.');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
