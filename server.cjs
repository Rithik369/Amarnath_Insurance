// Tiny zero-dependency web server that hosts the built website.
// Usage: node server.cjs   (PORT env var optional, default 80 with fallback to 8080)
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'dist', 'rml-insurances', 'browser');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
  console.error('Website is not built yet. Run START-WEBSITE.bat (or "npm run build") first.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  let file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(ROOT, 'index.html');
  }

  const ext = path.extname(file).toLowerCase();
  // Angular output files have a content hash in their name, so they can be cached forever.
  const hashed = /-[A-Z0-9]{8}\.(js|css)$/.test(path.basename(file));
  const cache = hashed ? 'public, max-age=31536000, immutable' : 'no-cache';
  res.writeHead(200, {
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': cache,
    'X-Content-Type-Options': 'nosniff',
  });
  fs.createReadStream(file).pipe(res);
});

function listen(port, fallback) {
  server.once('error', (err) => {
    if (fallback && (err.code === 'EADDRINUSE' || err.code === 'EACCES')) {
      console.warn(`Port ${port} is not available (${err.code}). Trying port ${fallback}...`);
      listen(fallback, null);
    } else {
      console.error(`Could not start server on port ${port}: ${err.message}`);
      process.exit(1);
    }
  });
  server.listen(port, () => {
    const suffix = port === 80 ? '' : `:${port}`;
    const lan = Object.values(require('os').networkInterfaces())
      .flat()
      .filter((n) => n && n.family === 'IPv4' && !n.internal)
      .map((n) => `http://${n.address}${suffix}`);
    console.log('');
    console.log('  RML Insurances website is running!');
    console.log(`  On this PC:            http://localhost${suffix}`);
    lan.forEach((u) => console.log(`  Other devices (Wi-Fi): ${u}`));
    console.log('');
    console.log('  Keep this window open. Close it (or press Ctrl+C) to stop the website.');
    console.log('');
    if (process.argv.includes('--open') && process.platform === 'win32') {
      require('child_process').spawn('cmd', ['/c', 'start', '', `http://localhost${suffix}`], {
        detached: true,
        stdio: 'ignore',
      });
    }
  });
}

const envPort = Number(process.env.PORT);
if (envPort) listen(envPort, null);
else listen(80, 8080);
