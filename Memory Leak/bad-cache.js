// Unbounded in-memory cache example (memory leak demo)

const express = require("express");
const app = express();

const cache = {};

// Log memory usage every 2 seconds
setInterval(() => {
  const mem = process.memoryUsage();
  console.log(
    `Cache size: ${Object.keys(cache).length} | Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`
  );
}, 2000);

app.get("/user/:id", (req, res) => {
  const id = req.params.id;

  if (!cache[id]) {
    cache[id] = {
      id,
      data: new Array(1e5).fill("user-data"),
    };
  }

  res.send("ok");
});

app.listen(3000, () => console.log("Server running on port 3000"));
