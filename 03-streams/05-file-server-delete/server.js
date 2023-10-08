const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad Request.');

        return;
      }

      if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end('File Not Found.');

        return;
      }

      try {
        await fsPromises.unlink(filepath);
        res.statusCode = 200;
        res.end('File Was Deleted.');
      } catch (error) {
        res.statusCode = 500;
        res.end();
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
