"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const auth_1 = require("../middleware/auth");
const store = new order_1.OrderStore();
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield store.getOrderByUserId(parseInt(req.params.userId));
    res.json(order);
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = req.body.products;
        const order_status = req.body.order_status;
        const user_id = req.body.user_id;
        if (products === undefined ||
            order_status === undefined ||
            user_id === undefined) {
            res.status(400);
            res.send("Some required parameters are missing! eg. :products, :order_status, :user_id");
            return false;
        }
        const order = yield store.create({
            products,
            order_status,
            user_id,
        });
        res.json(order);
    }
    catch (e) {
        res.status(400);
        res.json(e);
    }
});
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (id === undefined) {
            res.status(400);
            res.send("Missing required parameter :id.");
            return false;
        }
        yield store.delete(id);
        res.send(`FullOrder with id ${id} successfully deleted.`);
    }
    catch (e) {
        res.status(400);
        res.json(e);
    }
});
const orderRoute = (app) => {
    app.get("orders/:userId", show);
    app.post("/orders", auth_1.verifyAuthToken, create);
    app.delete("/orders/:id", auth_1.verifyAuthToken, deleteOrder);
};
exports.default = orderRoute;
