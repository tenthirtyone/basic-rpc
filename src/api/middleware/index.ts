import * as http from "http";

export const rpc = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void
) => {
  if (req.method === "POST") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: true }));
  } else {
    next();
  }
};
