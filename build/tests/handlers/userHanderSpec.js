"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../../server");
const request = (0, supertest_1.default)(server_1.app);
const SECRET = process.env.TOKEN_SECRET;
describe("User Handler", () => {
    const userData = {
        firstName: "Hans",
        lastName: "Meier",
        password: "password123",
    };
    let token, userId = 1;
    it("should require authorization on every endpoint", (done) => {
        request.get("/users").then((res) => {
            expect(res.status).toBe(401);
            done();
        });
        request.get(`/users/${userId}`).then((res) => {
            expect(res.status).toBe(401);
            done();
        });
        request.delete(`/users/${userId}`).then((res) => {
            expect(res.status).toBe(401);
            done();
        });
    });
    it("gets the create endpoint", (done) => {
        request
            .post("/users")
            .send(userData)
            .then((res) => {
            const { body, status } = res;
            token = body;
            // @ts-ignore
            const { user } = jsonwebtoken_1.default.verify(token, SECRET);
            userId = user.id;
            expect(status).toBe(200);
            done();
        });
    });
    it("gets the index endpoint", (done) => {
        request
            .get("/users")
            .set("Authorization", "bearer " + token)
            .then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });
    it("gets the read endpoint", (done) => {
        request
            .get(`/users/${userId}`)
            .set("Authorization", "bearer " + token)
            .then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });
    it("gets the auth endpoint", (done) => {
        request
            .post("/users/auth")
            .send({
            firstName: userData.firstName,
            lastName: userData.lastName,
            password: userData.password,
        })
            .set("Authorization", "bearer " + token)
            .then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });
    it("gets the auth endpoint with wrong password", (done) => {
        request
            .post("/users/auth")
            .send({
            firstName: userData.firstName,
            lastName: userData.lastName,
            password: "falsepassword",
        })
            .set("Authorization", "bearer " + token)
            .then((res) => {
            expect(res.status).toBe(401);
            done();
        });
    });
    it("gets the delete endpoint", (done) => {
        request
            .delete(`/users/${userId}`)
            .set("Authorization", "bearer " + token)
            .then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });
});
