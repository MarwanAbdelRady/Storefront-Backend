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
exports.OrderStore = void 0;
const database_1 = require("../database");
class OrderStore {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.client.connect();
                const sql = "SELECT * FROM orders";
                const { rows } = yield conn.query(sql);
                const productOrdersSql = "SELECT product_id, product_quantity FROM product_orders WHERE order_id=($1)";
                const orders = [];
                for (const order of rows) {
                    const { rows: productOrderRows } = yield conn.query(productOrdersSql, [
                        order.id,
                    ]);
                    orders.push(Object.assign(Object.assign({}, order), { products: productOrderRows }));
                }
                conn.release();
                return orders;
            }
            catch (err) {
                throw new Error(`Could not get orders. ${err}`);
            }
        });
    }
    create(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const { products, order_status, user_id } = order;
            try {
                const sql = "INSERT INTO orders (user_id, order_status) VALUES($1, $2) RETURNING *";
                const conn = yield database_1.client.connect();
                const { rows } = yield conn.query(sql, [user_id, order_status]);
                const order = rows[0];
                const productOrdersSql = "INSERT INTO product_orders (order_id, product_id, product_quantity) VALUES($1, $2, $3) RETURNING product_id, product_quantity";
                const productOrders = [];
                for (const product of products) {
                    const { product_id, product_quantity } = product;
                    const { rows } = yield conn.query(productOrdersSql, [
                        order.id,
                        product_id,
                        product_quantity,
                    ]);
                    productOrders.push(rows[0]);
                }
                conn.release();
                return Object.assign(Object.assign({}, order), { products: productOrders });
            }
            catch (err) {
                throw new Error(`Could not add new order for user ${user_id}. ${err}`);
            }
        });
    }
    getOrderByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.client.connect();
                const sql = `SELECT * FROM orders WHERE user_id = ${userId} ORDER BY id DESC LIMIT 1;`;
                const result = yield conn.query(sql);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot get the current order for the specified User ID ${err}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.client.connect();
                const productOrdersSql = "DELETE FROM product_orders WHERE order_id=($1)";
                yield conn.query(productOrdersSql, [id]);
                const sql = "DELETE FROM orders WHERE id=($1)";
                const { rows } = yield conn.query(sql, [id]);
                const order = rows[0];
                conn.release();
                return order;
            }
            catch (err) {
                throw new Error(`Could not delete order ${id}. ${err}`);
            }
        });
    }
}
exports.OrderStore = OrderStore;
