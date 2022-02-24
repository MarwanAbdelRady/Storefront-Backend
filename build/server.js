"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const productHandler_1 = __importDefault(require("./handlers/productHandler"));
const userHandler_1 = __importDefault(require("./handlers/userHandler"));
const orderHandler_1 = __importDefault(require("./handlers/orderHandler"));
exports.app = (0, express_1.default)();
const address = "0.0.0.0:3000";
exports.app.use((0, cors_1.default)());
exports.app.use(body_parser_1.default.json());
exports.app.get("/", function (req, res) {
    res.send("Hello World!");
    console.log(req.body);
});
(0, productHandler_1.default)(exports.app);
(0, userHandler_1.default)(exports.app);
(0, orderHandler_1.default)(exports.app);
exports.app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
