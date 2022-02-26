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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../../server");
const database_1 = require("../../database");
const request = (0, supertest_1.default)(server_1.app);
const SECRET = database_1.process.env.TOKEN_SECRET;
describe("Product Handler", () => {
    const product = {
        product_name: "CodeMaster 3000",
        price: 999,
    };
    let token, userId, productId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            firstname: "Produkt",
            lastname: "Tester",
            user_password: "password123",
        };
        const { body } = yield request.post("/users").send(userData);
        token = body;
        // @ts-ignore
        const { user } = jsonwebtoken_1.default.verify(token, SECRET);
        userId = Number(user.id);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield request
            .delete(`/users/${userId}`)
            .set("Authorization", "bearer " + token);
    }));
    it("gets the create endpoint", (done) => {
        request
            .post("/products")
            .send(product)
            .set("Authorization", "bearer " + token)
            .then((res) => {
            const { body, status } = res;
            expect(status).toBe(200);
            productId = body.id;
            done();
        });
    });
    it("gets the index endpoint", (done) => {
        request.get("/products").then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });
    it("gets the read endpoint", (done) => {
        request.get(`/products/${productId}`).then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });
    it("gets the delete endpoint", (done) => {
        request
            .delete(`/products/${productId}`)
            .set("Authorization", "bearer " + token)
            .then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });
});
