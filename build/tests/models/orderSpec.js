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
const order_1 = require("../../models/order");
const user_1 = require("../../models/user");
const product_1 = require("../../models/product");
const os = new order_1.OrderStore();
describe("FullOrder Model", () => {
    const us = new user_1.UserStore();
    const ps = new product_1.ProductStore();
    let order, user_id, product_id;
    function createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return os.create(order);
        });
    }
    function deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return os.delete(id);
        });
    }
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield us.create({
            firstName: "Hans",
            lastName: "Meier",
            password: "password123",
        });
        user_id = user.id;
        const product = yield ps.create({
            product_name: "OrderSpec FullProduct",
            price: 99,
        });
        product_id = product.id;
        order = {
            products: [
                {
                    product_id,
                    product_quantity: 5,
                },
            ],
            user_id,
            order_status: "complete",
        };
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield us.delete(user_id);
        yield ps.delete(product_id);
    }));
    it("should have an index method", () => {
        expect(os.index).toBeDefined();
    });
    it("should have a add method", () => {
        expect(os.create).toBeDefined();
    });
    it("should have a get order by user id method", () => {
        expect(os.getOrderByUserId).toBeDefined();
    });
    it("should have a delete method", () => {
        expect(os.delete).toBeDefined();
    });
    it("add method should add an order", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdOrder = yield createOrder(order);
        expect(createdOrder).toEqual(Object.assign({ id: createdOrder.id }, order));
        yield deleteOrder(createdOrder.id);
    }));
    it("index method should return a list of orders", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdOrder = yield createOrder(order);
        const orderList = yield os.index();
        expect(orderList).toEqual([createdOrder]);
        yield deleteOrder(createdOrder.id);
    }));
    it("delete method should remove the order", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdOrder = yield createOrder(order);
        yield deleteOrder(createdOrder.id);
        const orderList = yield os.index();
        expect(orderList).toEqual([]);
    }));
});
