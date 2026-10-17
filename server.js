const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Optional local development server. The games also run directly on GitHub Pages.
const routes = {'/':'index.html', '/app.js':'app.js', '/style.css':'style.css'};
const server = http.createServer((req, res) => {
  const file = routes[new URL(req.url, 'http://localhost').pathname];
  if (!file) {
    res.writeHead(404);
    return res.end('Not found');
  }
  res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');
  fs.createReadStream(path.join(__dirname, 'public', file)).pipe(res);
});
if (require.main === module) {
  server.listen(process.env.PORT || 3000, '0.0.0.0', () => console.log('Playroom listening on port ' + (process.env.PORT || 3000)));
}
module.exports = {server};
