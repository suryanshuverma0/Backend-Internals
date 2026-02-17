const MAX_BODY_SIZE = 1e6; // 1 MB

const readBody = (req) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let done = false;

    req.on("data", (chunk) => {
      if (done) return;

      size += chunk.length;

      if (size > MAX_BODY_SIZE) {
        done = true;
        reject({ type: "BODY_TOO_LARGE" });
        req.removeAllListeners("data");
        req.removeAllListeners("end");
        return;
      }

      chunks.push(chunk);
    });

    req.on("end", () => {
      if (done) return;

      if (chunks.length === 0) {
        reject({ type: "EMPTY_BODY" });
        return;
      }

      const body = Buffer.concat(chunks).toString();

      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch {
        reject({ type: "INVALID_JSON" });
        return;
      }

      resolve(parsed);
    });

    req.on("error", () => {
      if (done) return;
      reject({ type: "INVALID_JSON" });
    });
  });
};

module.exports = { readBody };
