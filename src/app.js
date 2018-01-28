import polka from 'polka';
import body from 'body-parser';
import LRUCache from './LRUCache';

// When the Express app starts up, create a new LRU cache
const lru = new LRUCache({ capacity: 5 });

// Choose a port to listen on, preferentially taking input from ENV
const port = process.env.PORT || 8080;

// Start the music! 👯
polka()
  // Automatically parse request bodies
  .use(body.json())

  // Root path to welcome visitors
  // Possible TODO: UI for interacting with cache
  .get('/', (req, res) =>
    res.end("Welcome to the most barebones LRU caching app you've ever seen!"),
  )

  // Root /cache route for handling no params
  // TODO: Change to a more "stern" message about supplying a key
  .get('/cache', (req, res) =>
    res.end(`Welcome! Most recently updated cache item: ${lru.get()}.`),
  )

  // GET /cache/:key - get value for given key
  // Validate a key parameter passed in by user. Check to see if key currently exists in cache.
  // If key exists, return status 200 and display key's value
  .get('/cache/:key', (req, res) => {
    const { key } = req.params; // grab key from URL params

    // TODO: param validation

    return res.end(lru.get(key));
  })

  // POST /cache - new key
  // Use request body params `key` and `value` to store a new K/V pair in the cache
  .post('/cache', (req, res) => {
    // Grab the new key and value from query params
    const { key, value } = req.body;

    try {
      const newItem = lru.put(key, value);
      return res.end(JSON.stringify(newItem));
    } catch (ex) {
      // TODO: send a prettier error message
      res.statusCode = 500;
      return res.end(ex.message);
    }
  })

  // DELETE /cache/:key - remove a K/V pair from the cache
  .delete('/cache/:key', (req, res) => {
    const { key } = req.params; // grab key from URL params

    // TODO: param validation
    const found = lru.delete(key);
    if (found) {
      return res.end('Key found and deleted successfully.');
    }

    // TODO: investigate more appropriate HTTP codes for this situation
    return res.end('Key could not be found in cache.');
  })

  // PUT /cache/:key - update the value associated with a specific key
  .put('/cache/:key', (req, res) => {
    const { key } = req.params; // grab key from URL params
    const { value } = req.body; // get new value from request body

    // TODO: param validation

    try {
      const newItem = lru.put(key, value);
      return res.end(JSON.stringify(newItem));
    } catch (ex) {
      // TODO: send a prettier error message
      res.statusCode = 500;
      return res.end(ex.message);
    }
  })

  .listen(port)
  .then(() => console.log(`Polka server listening at localhost:${port}...`));
