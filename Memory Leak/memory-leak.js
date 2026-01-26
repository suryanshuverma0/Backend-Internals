// Demonstrates an intentional memory leak in Node.js

const leak = [];

setInterval(() => {
  leak.push({
    data: new Array(1e5).fill("leak"),
    time: Date.now()
  });

  const mem = process.memoryUsage();
  console.log(
    `Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`
  );
}, 500);
