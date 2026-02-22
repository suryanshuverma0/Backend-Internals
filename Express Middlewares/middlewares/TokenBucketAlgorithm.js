const buckets = new Map();

function tokenBucket({ capacity, refillRate, windowMs = 60000 }) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    let bucket = buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: capacity,
        lastRefill: now,
        expires: now + windowMs
      };
      buckets.set(key, bucket);
    }

    // Auto cleanup
    if (now > bucket.expires) {
      bucket.tokens = capacity;
      bucket.lastRefill = now;
      bucket.expires = now + windowMs;
    }

    // Refill logic
    const elapsed = (now - bucket.lastRefill) / 1000;
    const refill = Math.floor(elapsed * refillRate);

    if (refill > 0) {
      bucket.tokens = Math.min(capacity, bucket.tokens + refill);
      bucket.lastRefill = now;
    }

    if (bucket.tokens <= 0) {
      return res.status(429).send("Too many requests");
    }

    bucket.tokens--;
    next();
  };
}
module.exports = { tokenBucket };