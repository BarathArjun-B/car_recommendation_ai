const cache = new Map();

const getTtlMs = () => Number(process.env.CACHE_TTL_SECONDS || 120) * 1000;

export const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
};

export const setCache = (key, value) => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + getTtlMs(),
  });
};

export const clearCache = () => {
  cache.clear();
};
