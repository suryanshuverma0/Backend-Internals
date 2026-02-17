const http = require("http");
const { send } = require("./helper/helper");
const { readBody } = require("./body");
  let activeRequests = 0;
  let shuttingDown = false;
const server = http.createServer((req, res) => {
  const { url, method } = req;

  let finished = false;

  if (shuttingDown) {
  res.statusCode = 503;
  res.end(JSON.stringify({ error: "Server shutting down" }));
  return;
}

  activeRequests++;
  const timeout = setTimeout(() => {
  safeSend(408, { error: "Request timeout" });
}, 3000);

  const safeSend = (status, data) => {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    send(res, status, data);
    activeRequests--;

  };

  if (url === "/health" && method === "GET") {
    return safeSend(200, { status: "ok" });
  }

  if (url === "/login" && method === "POST") {
    const errorToStatus = {
      BODY_TOO_LARGE: 413,
      EMPTY_BODY: 400,
      INVALID_JSON: 400,
    };

    return readBody(req)
      .then((body) => {
        const { email, password } = body;

        if (!email || !password) {
          return safeSend(422, { error: "email and password required" });
        }

        if (email !== "admin@test.com" || password !== "secret") {
          return safeSend(401, { error: "Invalid credentials" });
        }

        return safeSend(200, { message: "Login successful" });
      })
      .catch((err) => {
        const status = errorToStatus[err.type] || 500;
        return safeSend(status, { error: err.type });
      });
  }

  if (url === "/slow" && method === "GET") {
    setTimeout(() => {
      if (finished) return;
      safeSend(200, { message: "Slow response" });
    }, 5000);
    return;
  }

  return safeSend(404, { error: "Not Found" });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

process.on("SIGINT", initiateShutdown);
process.on("SIGTERM", initiateShutdown);

function initiateShutdown() {
  if (shuttingDown) return;

  console.log("\nGraceful shutdown started...");
  shuttingDown = true;

  server.close(() => {
    console.log("No longer accepting new connections");
  });

  const interval = setInterval(() => {
    if (activeRequests === 0) {
      console.log("All requests finished. Exiting.");
      clearInterval(interval);
      process.exit(0);
    }
  }, 500);
}