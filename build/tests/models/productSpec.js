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
const product_1 = require("../../models/product");
const ps = new product_1.ProductStore();
describe("Product Model", () => {
    const product = {
        product_name: "CodeMaster 3000",
        price: 2000,
    };
    function createProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            return ps.create(product);
        });
    }
    function deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return ps.delete(id);
        });
    }
    it("It should have an index method", () => {
        expect(ps.index).toBeDefined();
    });
    it("It should have a show method", () => {
        expect(ps.show).toBeDefined();
    });
    it("It should have a add method", () => {
        expect(ps.create).toBeDefined();
    });
    it("add method should add a product", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdProduct = yield createProduct(product);
        expect(createdProduct).toEqual({
            id: createdProduct.id,
            product_name: product.product_name,
            price: product.price,
        });
        yield deleteProduct(createdProduct.id);
    }));
    it("index method should return a list of products", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdProduct = yield createProduct(product);
        const productList = yield ps.index();
        expect(productList).toEqual([createdProduct]);
        yield deleteProduct(createdProduct.id);
    }));
    it("show method should return the correct product", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdProduct = yield createProduct(product);
        const productFromDb = yield ps.show(createdProduct.id);
        expect(productFromDb).toEqual(createdProduct);
        yield deleteProduct(createdProduct.id);
    }));
});
