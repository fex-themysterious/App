const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = __dirname + require('path').sep;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = path.join(ROOT, urlPath === '/' ? '/index.html' : urlPath);

    const normalized = path.normalize(filePath);
    if (!normalized.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    fs.stat(normalized, (err, stat) => {
      if (err || !stat.isFile()) {
        const ext = path.extname(normalized).toLowerCase();
        if (ext && ext !== '.html') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('Not found');
        }
        const indexPath = path.join(__dirname, 'index.html');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        return fs.createReadStream(indexPath).pipe(res);
      }
      const ext = path.extname(normalized).toLowerCase();
      const type = MIME[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': type,
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      });
      fs.createReadStream(normalized).pipe(res);
    });
  } catch (e) {
    res.writeHead(500);
    res.end('Server error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Syllabus Tracker serving on http://${HOST}:${PORT}`);
});
