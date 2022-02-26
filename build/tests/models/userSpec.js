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
const user_1 = require("../../models/user");
const us = new user_1.UserStore();
describe("User Model", () => {
    const user = {
        firstname: "Hans",
        lastname: "Meier",
        user_password: "password123",
    };
    function createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return us.create(user);
        });
    }
    function deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return us.delete(id);
        });
    }
    it("should have an index method", () => {
        expect(us.index).toBeDefined();
    });
    it("should have a show method", () => {
        expect(us.show).toBeDefined();
    });
    it("should have a create method", () => {
        expect(us.create).toBeDefined();
    });
    it("should have a remove method", () => {
        expect(us.delete).toBeDefined();
    });
    it("create method should create a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield createUser(user);
        if (createdUser) {
            const { firstname, lastname } = createdUser;
            expect(firstname).toBe(user.firstname);
            expect(lastname).toBe(user.lastname);
        }
        yield deleteUser(createdUser.id);
    }));
    it("index method should return a list of users", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield createUser(user);
        const userList = yield us.index();
        expect(userList).toEqual([createdUser]);
        yield deleteUser(createdUser.id);
    }));
    it("show method should return the correct users", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield createUser(user);
        const userFromDb = yield us.show(createdUser.id);
        expect(userFromDb).toEqual(createdUser);
        yield deleteUser(createdUser.id);
    }));
    it("remove method should remove the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield createUser(user);
        yield deleteUser(createdUser.id);
        const userList = yield us.index();
        expect(userList).toEqual([]);
    }));
    it("authenticates the user with a user_password", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield createUser(user);
        const userFromDb = yield us.authenticateUser(user.firstname, user.lastname, user.user_password);
        if (userFromDb) {
            const { firstname, lastname } = userFromDb;
            expect(firstname).toBe(user.firstname);
            expect(lastname).toBe(user.lastname);
        }
        yield deleteUser(createdUser.id);
    }));
});
