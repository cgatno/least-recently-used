import polka from 'polka';
import body from 'body-parser';
import LRUCache from './LRUCache';

// Create a new LRU cache
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
  .get('/cache', (req, res) => {
    if (lru.store.size > 0) {
      res.end(JSON.stringify(lru.store.entries().next().value));
    }

    return res.end("There's nothing in the cache yet!");
  })

  // GET /cache/:key - get value for given key
  // Validate a key parameter passed in by user. Check to see if key currently exists in cache.
  // If key exists, return status 200 and display key's value
  // If key doesn't exist, returns status 200 and most recently used value
  .get('/cache/:key', (req, res) => {
    const { key } = req.params; // grab key from URL params

    const val = lru.get(key);

    // If value exists for given key, send back 200 and the value
    if (val) {
      return res.end(val);
    }

    // Send a 404 and key not found message otherwise
    res.statusCode = 404;
    return res.end(`The key '${key}' doesn't exist in the cache.`);
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
      console.error(ex);
      res.statusCode = 500;
      return res.end('Error while adding pair to the cache.');
    }
  })

  // DELETE /cache/:key - remove a K/V pair from the cache
  .delete('/cache/:key', (req, res) => {
    const { key } = req.params; // grab key from URL params

    const found = lru.delete(key);
    if (found) {
      return res.end(`Key '${key}' deleted successfully.`);
    }

    // Return 404 for nonexistent key
    res.statusCode = 404;
    return res.end(`Key '${key}' couldn't be found in cache.`);
  })

  // PUT /cache/:key - update the value associated with a specific key
  .put('/cache/:key', (req, res) => {
    const { key } = req.params; // grab key from URL params
    const { value } = req.body; // get new value from request body

    try {
      const newItem = lru.put(key, value);
      return res.end(JSON.stringify(newItem));
    } catch (ex) {
      // TODO: send a prettier error message
      res.statusCode = 500;
      console.error(ex);
      return res.end('Error while updating pair.');
    }
  })

  .listen(port)
  .then(() => console.log(`Polka server listening at localhost:${port}...`));
