const express = require("express");
const app = express();
const { tokenBucket } = require("./middlewares/TokenBucketAlgorithm");

app.use(tokenBucket({
  capacity: 10,
  refillRate: 1
}));
app.use((req, res, next) => {
  console.log("Middleware 1");
  next();
});

app.use((req, res, next) => {
  console.log("Middleware 2");
  next()  //intentionally missing
});

app.use((req, res, next) => {
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(3000);