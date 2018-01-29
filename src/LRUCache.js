import uuid from 'uuid/v1';

// Logic for Least Recently Used (LRU) cache

// Goals:
// - quick lookup via key
// - quick sorting by update time
// - dynamically update order when an operation takes place
// - automatically remove least recently used item if capacity reached

// Phase 1: The LRU cache will maintain an internal store of data using a native JavaScript Map object.

// Improvements:
// - Add persist/load functions to save the cache to disk and load it from disk

export default class LRUCache {
  constructor(
    { seedData = [], capacity = 25 } = { seedData: [], capacity: 25 },
  ) {
    // The LRU cache must have an upper limit to its capacity
    this.capacity = capacity;

    // Any seed data should be an iterable of key/value pairs, e.g.
    // [['key1', 'value1'], ['key2', 'value2']]
    // Seed data will be loaded into the cache in the order it is supplied
    // (index 0 is "most recently updated")
    // TODO: validate constructor arguments

    // Create a new Map linked to this cache for storing entries
    this.store = new Map(seedData);
  }

  /**
   * Accesses an entry in the cache by its key and returns the associated value.
   * Note that accession pushes the K/V pair to the 'top' of the recently updated list.
   * @param {string?} key The key to look up for retrieval. If not provided, the most recently updated
   * value is returned.
   */
  get(key) {
    // Map objects automatically return `undefined` for keys they don't have
    // Get the value for a given key or default to the first value
    const val = this.store.get(key);

    // Only remove an item and refresh the store if a value was ultimately found
    if (val) {
      // Remove the accessed K/V pair from the store, then refresh the store with the pair at the "top"
      this.store.delete(key);
      this.store = new Map([[key, val], ...this.store.entries()]);
    }

    return val;
  }

  /**
   * Updates a K/V pair if the provided key exists or adds a new pair if it doesn't.
   * @param {string} key The key to look up or add
   * @param {string?} value The new value for the associated key. Defaults to empty string for
   * updates, current timestamp for new K/V pairs.
   */
  put(key, value = '') {
    // Do some routine validation of the provided key first
    if (!key) {
      throw new Error('No key provided for cache item update.');
    }
    if (!this.store.has(key)) {
      // The key doesn't exist in the store, so try to add a new one
      const newKey = key || uuid(); // default to a time-based key if none provided
      const newVal = (value.length > 0 && value) || Date.now().toString(); // Default to timestamp value

      // Refresh the store with the new K/V pair
      // If the store is at max capacity, cut out the last item and notify via console
      if (this.store.size === this.capacity) {
        console.warn(
          `Max entries reached! Removing one before adding [${newKey}, ${newVal}]...`,
        );
      }
      const entriesToKeep =
        this.store.size === this.capacity
          ? [...this.store.entries()].slice(0, -1)
          : [...this.store.entries()];
      this.store = new Map([[newKey, newVal], ...entriesToKeep]);

      // Return the new KV pair
      return [newKey, newVal];
    }

    // We know that a key was provided and it exists in the store, so refresh store with new K/V at top
    // Remove old K/V pair
    this.store.delete(key);

    // New store with new K/V pair and order
    this.store = new Map([[key, value], ...this.store.entries()]);

    // Return the new KV pair
    return [key, value];
  }

  /**
   * Removes a key/value pair from the LRU cache, maintaining positions of all other items.
   * Returns true if key was found, false otherwise.
   * @param {string} key The key of the K/V pair to delete
   */
  delete(key) {
    // A simple delete operation on the Map should remove this item and maintain positions of everything else
    const success = this.store.delete(key);

    return success;
  }
}
