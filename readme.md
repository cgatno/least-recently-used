# Least Recently Used Cache

An in-memory implementation of a Least Recently Used (LRU) cache using Node.js. The cache will be accessible via HTTP request using an Express.js interface.

## Requirements

The LRU contained within will implement the following functionality:

* The cache should be finite and hold up to a maximum number of elements.
* The cache should implement ‘get,’ ‘put,’ and ‘delete' operations.
* The cache should discard the least recently used elements first.
* The cache should be accessible using HTTP.

## Using the Cache

You can access the cache using any web browser/HTTP client. Consult the list of routes below for access instructions:

**GET**

> /cache/{key}

returns 200 + the value for a key.

If no `key` value is provided, the most recently updated value is returned.

**DELETE**

> /cache/{key}

deletes the key from the cache

**POST**

> /cache?key=k&value=v

adds a key/value pair to the cache

**PUT**

> /cache/{key}?value=v

updates the value for a key

## Roadmap (TODO)

* Outfit toolchain with nodemon to automatically reload in dev environment
* Test performance of JavaScript Map to see if more performant implementation is necessary
* Provide more user-friendly errors and correct HTTP codes
* Build UI for interacting with the Express API and underlying cache
* Add persist/load functions to LRU cache
* More advanced logging/output
* Promisify LRUCache.js for async operations

## Development

To get up and running:

        cd LRU
        npm install
        npm run build
        npm start

Visit localhost:8080 and access the routes outlined above to test! Note that `npm run build` will monitor the src/ directory for changes and automatically re-transpile with babel.
