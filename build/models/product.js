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
exports.ProductStore = void 0;
/* eslint-disable prettier/prettier */
const database_1 = require("../database");
class ProductStore {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.client.connect();
                const sql = `SELECT * FROM products;`;
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`Cannot get products ${err}`);
            }
        });
    }
    show(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.client.connect();
                const sql = `SELECT * FROM products WHERE id=$1;`;
                const result = yield conn.query(sql, [productId]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Product with this ID could not be found. Error ${err}`);
            }
        });
    }
    create(p) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { product_name, price } = p;
                const conn = yield database_1.client.connect();
                const sql = `INSERT INTO products(product_name, price) VALUES($1, $2) RETURNING *;`;
                const result = yield conn.query(sql, [product_name, price]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Product could not be created. Error: ${err}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = "DELETE FROM products WHERE id=($1)";
                const conn = yield database_1.client.connect();
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Could not delete product ${id}. ${err}`);
            }
        });
    }
}
exports.ProductStore = ProductStore;
