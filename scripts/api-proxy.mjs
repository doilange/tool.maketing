import { createServer } from "node:http";

const port = Number(process.env.API_PORT || 8005);
const target = process.env.API_TARGET || "http://localhost:3005";

createServer(async (req, res) => {
  const url = new URL(req.url || "/", target);

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method || "") ? undefined : req,
      duplex: "half",
      redirect: "manual",
    });

    res.writeHead(upstream.status, Object.fromEntries(upstream.headers));

    if (upstream.body) {
      await upstream.body.pipeTo(
        new WritableStream({
          write(chunk) {
            res.write(chunk);
          },
          close() {
            res.end();
          },
          abort(error) {
            res.destroy(error);
          },
        }),
      );
    } else {
      res.end();
    }
  } catch (error) {
    res.writeHead(502, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        error: "API proxy could not reach the Next server",
        target,
        detail: error instanceof Error ? error.message : String(error),
      }),
    );
  }
}).listen(port, () => {
  console.log(`API proxy ready at http://localhost:${port}`);
  console.log(`Forwarding requests to ${target}`);
});
