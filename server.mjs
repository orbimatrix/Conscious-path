import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { getSocketServer } from './src/lib/socket-server.js';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Prepare the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Initialize Socket.io server
  const socketServer = getSocketServer(server);
  if (socketServer) {
    console.log('> Socket.io server initialized successfully');
  } else {
    console.log('> Socket.io server initialization failed');
  }

  // Start the server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log('> Server started with Socket.io support');
  });
});
