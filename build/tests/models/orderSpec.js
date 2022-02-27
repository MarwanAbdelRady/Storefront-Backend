"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var order_1 = require("../../models/order");
var order = new order_1.OrderStore();
describe('Order Model', function () {
    it('should have a create method', function () {
        expect(order.create).toBeDefined();
    });
    // it('create method should create new order with new associated order_product', async () => {
    //   const orderProduct = { product_id: 1, quantity: 1 };
    //   const result = await order.create('active', 2, [orderProduct]);
    //   expect(result).toEqual([]);
    // });
});
