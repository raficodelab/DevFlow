import { useSyncExternalStore } from "react";

const collections = new Map();

function getCollection(key, initialData) {
  if (collections.has(key)) return collections.get(key);

  let data;

  try {
    const saved = localStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : null;
    data = Array.isArray(parsed) ? parsed : initialData;
  } catch {
    data = initialData;
  }

  const listeners = new Set();

  const collection = {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    getSnapshot() {
      return data;
    },

    update(updater) {
      data = updater(data);
      localStorage.setItem(key, JSON.stringify(data));
      listeners.forEach((listener) => listener());
    },

    syncFromStorage(event) {
      if (event.key !== key) return;

      try {
        const parsed = event.newValue
          ? JSON.parse(event.newValue)
          : initialData;

        data = Array.isArray(parsed) ? parsed : initialData;
        listeners.forEach((listener) => listener());
      } catch {
        // Ignore invalid external storage values.
      }
    },
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", collection.syncFromStorage);
  }

  collections.set(key, collection);
  return collection;
}

export function useStoredCollection(key, initialData) {
  const collection = getCollection(key, initialData);

  const items = useSyncExternalStore(
    collection.subscribe,
    collection.getSnapshot
  );

  return [items, collection.update];
}