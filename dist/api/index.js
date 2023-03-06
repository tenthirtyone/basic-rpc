"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
class API {
    constructor() {
        this._middlewares = [];
        this._server = http.createServer((req, res) => {
            const handleRequest = (index) => {
                if (index >= this._middlewares.length) {
                    // If all middlewares have been executed, handle the request using the final request handler
                    this.handleRequest(req, res);
                }
                else {
                    // Otherwise, call the next middleware in the chain
                    const middleware = this._middlewares[index];
                    middleware(req, res, () => handleRequest(index + 1));
                }
            };
            handleRequest(0);
        });
    }
    use(middleware) {
        this._middlewares.push(middleware);
    }
    handleRequest(_req, res) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("Not Found!");
    }
    start() {
        this._server.listen(4000, () => {
            console.log("Server running on port 4000");
        });
    }
    stop() {
        this._server.close();
    }
}
exports.default = API;
