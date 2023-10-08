const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad Request.');
      }

      const readStream = fs.createReadStream(filepath);

      readStream.on('error', (error) => {
        let message = 'Unknown error.';

        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          message = 'Not Found.';
        } else {
          res.statusCode = 500;
          message = 'Server Error.';
        }

        res.end(message);
      });

      readStream.pipe(res);

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
