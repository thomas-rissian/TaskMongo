const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

// Gestion basique des erreurs
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});