const http = require("http");
const { send } = require("./helper/helper");
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/health" && method === "GET") {
    send(res, 200, { status: "ok" });
  } else {
    send(res, 404, { error: "Not Found" });
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
