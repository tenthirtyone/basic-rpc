"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rpc = void 0;
const utils_1 = require("../../utils");
const rpc = (blockchain) => {
    const jsonrpc = new RPC(blockchain);
    return (req, res, next) => {
        if (req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", async () => {
                console.log("Received POST body:", body);
                const postBody = JSON.parse(body);
                const { method, params } = postBody;
                console.log(method);
                try {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.end(await jsonrpc[method](...params));
                }
                catch (e) {
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "text/plain");
                    res.end("Error");
                }
            });
        }
        else {
            next();
        }
    };
};
exports.rpc = rpc;
class RPC {
    constructor(blockchain) {
        this._blockchain = blockchain;
    }
    async eth_getBlockByNumber(blockNumber) {
        return JSON.stringify(await this._blockchain.getBlock((0, utils_1.convertToBigInt)(blockNumber)));
    }
}
