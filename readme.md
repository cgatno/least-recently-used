# Least Recently Used (LRU) Cache with Node.js Map 🗺️

A straightforward [Least Recently Used (LRU) cache](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_Recently_Used_(LRU)>) implementation using the [native Map object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) in Node.js. Bundled with [Polka](https://github.com/lukeed/polka) HTTP server for easy access.

## Getting Started

        git clone https://github.com/cgatno/least-recently-used.git
        cd least-recently-used
        npm install
        npm start

See the [HTTP interface specs](#http-interface) below for info on using the cache.

## Features

This LRU caching app implements the following functionality:

* Finite and hold up to a maximum number of elements
* Supports ‘get,’ ‘put,’ and ‘delete' operations
* Discards the least recently used elements first
* Accessible using HTTP

## Using the Cache

You can access the cache using any HTTP client (or web browser for GET requests). I recommend [Postman](https://www.getpostman.com/) or [httpie](https://httpie.org/).

See below for a list of app endpoints.

## HTTP Interface

By default, the app listens at `http://localhost:8080`. The port can be overriden using the `PORT` environment variable. (E.g. `PORT=4343 npm start`)

| Endpoint       | Request Type | Input (application/json)         | Response Code | Response Description                                               |
| -------------- | ------------ | -------------------------------- | ------------- | ------------------------------------------------------------------ |
| `/`            | GET          | N/A                              | 200           | Friendly, descriptive welcome message 😊                           |
| `/cache`       | GET          | N/A                              | 200           | JSON array of form `[<key>, <value>]` for most recently used pair. |
|                | POST         | `{key: string?, value: string?}` | 200           | JSON array of form `[<new key>, <new value>]`                      |
|                |              |                                  | 500           | Add pair error message - stack trace logged to Node console        |
| `/cache/{key}` | GET          | N/A                              | 200           | Plaintext value for the given key                                  |
|                |              |                                  | 404           | Key not found message                                              |
|                | DELETE       | N/A                              | 200           | Key deleted message                                                |
|                |              |                                  | 404           | Key not found message                                              |
|                | PUT          | `{value: string?}`               | 200           | JSON array of form `[<key>, <new value>]`                          |
|                |              |                                  | 500           | Key update error message - stack trace logged to Node console      |

## Roadmap (TODO)

* Outfit toolchain with nodemon to automatically reload in dev environment
* Test performance of JavaScript Map to see if more performant implementation is necessary
* Build UI for interacting with the Express API and underlying cache
* Add persist/load functions to LRU cache
* Promisify LRUCache.js for async operations
