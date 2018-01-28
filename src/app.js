import express from 'express';
import body from 'body-parser';

// Individual routes
import CacheRoute from './routes/cache';

// Create new instance of Express app
const app = express();

// Add body-parser middleware for POST JSON
app.use(body.json());

// Express app root path to welcome visitors
app.get('/', (req, res) =>
  res
    .status(200)
    .send("Welcome to the most barebones LRU caching app you've ever seen!"),
);

// Load the self-contained routes into Express app
app.use('/cache', CacheRoute);

// Choose a port to listen on, preferentially taking input from ENV
const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`Express server listening at localhost:${port}...`),
);
