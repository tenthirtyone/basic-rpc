import * as http from "http";

export type Middleware = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void
) => void;

export default class API {
  private _server: http.Server;
  private _middlewares: Middleware[] = [];

  constructor() {
    this._server = http.createServer((req, res) => {
      const handleRequest = (index: number) => {
        if (index >= this._middlewares.length) {
          // If all middlewares have been executed, handle the request using the final request handler
          this.handleRequest(req, res);
        } else {
          // Otherwise, call the next middleware in the chain
          const middleware = this._middlewares[index];
          middleware(req, res, () => handleRequest(index + 1));
        }
      };

      handleRequest(0);
    });
  }

  use(middleware: Middleware): void {
    this._middlewares.push(middleware);
  }

  private handleRequest(
    _req: http.IncomingMessage,
    res: http.ServerResponse
  ): void {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found!");
  }

  start(): void {
    this._server.listen(4000, () => {
      console.log("Server running on port 4000");
    });
  }

  stop(): void {
    this._server.close();
  }
}
