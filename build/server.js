"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var appConfig_1 = __importDefault(require("./configuarations/appConfig"));
var userHandler_1 = __importDefault(require("./handlers/userHandler"));
var orderHandler_1 = __importDefault(require("./handlers/orderHandler"));
var productHandler_1 = __importDefault(require("./handlers/productHandler"));
var PORT = appConfig_1.default.port || 3000;
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.get('/', function (req, res) {
    res.json({
        message: 'Hello World!'
    });
});
(0, userHandler_1.default)(app);
(0, productHandler_1.default)(app);
(0, orderHandler_1.default)(app);
app.listen(PORT, function () {
    console.log("Server is starting at port: ".concat(PORT));
});
exports.default = app;
