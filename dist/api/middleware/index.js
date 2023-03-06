"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rpc = void 0;
const rpc = (req, res, next) => {
    if (req.method === "POST") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: true }));
    }
    else {
        next();
    }
};
exports.rpc = rpc;
