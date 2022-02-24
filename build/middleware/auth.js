"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = void 0;
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
// export function generate(data: TokenData, expiresIn?: string | number) {
//   return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn });
// }
const verifyAuthToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader ? authorizationHeader.split(" ")[1] : "";
        const decoded = jsonwebtoken_1.default.verify(token, database_1.process.env.TOKEN_SECRET);
        res.locals.userData = decoded;
        next();
    }
    catch (err) {
        res.status(401);
        res.json("Access denied, invalid token");
        next(err);
    }
};
exports.verifyAuthToken = verifyAuthToken;
