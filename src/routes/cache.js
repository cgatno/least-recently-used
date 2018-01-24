import express from 'express';
import LRUCache from '../lib/LRUCache';

// New Router object to pass back to main Express app
const router = express.Router();

// Note: possible that GET, DELETE and PUT routes could be condensed into one function, called
// variationally based on HTTP verb

// When the Express app starts up, create a new LRU cache
const lru = new LRUCache({ capacity: 5 });

// Root /cache route for handling no params
// TODO: Change to a more "stern" message about supplying a key
router.get('/', (req, res) =>
  res
    .status(200)
    .send(`Welcome! Most recently updated cache item: ${lru.get()}.`),
);

// GET /cache/:key - get value for given key
// Validate a key parameter passed in by user. Check to see if key currently exists in cache.
// If key exists, return status 200 and display key's value
router.get('/:key', (req, res) => {
  const { key } = req.params; // grab key from URL params

  // TODO: param validation

  return res.status(200).send(lru.get(key));
});

// POST /cache - new key
// Use query params `key` and `value` to store a new K/V pair in the cache
router.post('/', (req, res) => {
  // Grab the new key and value from query params
  const { key, value } = req.query;

  try {
    const newItem = lru.addItem(key, value);
    return res.status(200).json(newItem);
  } catch (ex) {
    // TODO: send a prettier error message
    return res.status(500).send(ex.message);
  }
});

// DELETE /cache/:key - remove a K/V pair from the cache
router.delete('/:key', (req, res) => {
  const { key } = req.params; // grab key from URL params

  // TODO: param validation
  const found = lru.delete(key);
  if (found) {
    return res.status(200).send('Key found and deleted successfully.');
  }

  // TODO: investigate more appropriate HTTP codes for this situation
  return res.status(200).send('Key could not be found in cache.');
});

// PUT /cache/:key - update the value associated with a specific key
router.put('/:key', (req, res) => {
  const { key } = req.params; // grab key from URL params
  const { value } = req.query; // get new value from query params

  // TODO: param validation

  try {
    const newItem = lru.put(key, value);
    return res.status(200).json(newItem);
  } catch (ex) {
    // TODO: send a prettier error message
    return res.status(500).send(ex.message);
  }
});

export default router;
