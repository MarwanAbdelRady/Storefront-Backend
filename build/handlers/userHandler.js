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
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
const auth_1 = require("../middleware/auth");
const store = new user_1.UserStore();
const index = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield store.index();
    res.json(user);
});
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield store.show(parseInt(req.params.id));
    res.json(user);
});
const create = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        firstName: _req.body.firstName,
        lastName: _req.body.lastName,
        password: _req.body.password,
    };
    const newUser = yield store.create(user);
    const token = jsonwebtoken_1.default.sign({ user: newUser }, database_1.process.env.TOKEN_SECRET);
    res.json(token);
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (id === undefined) {
            res.status(400);
            res.send("Missing required parameter :id.");
            return false;
        }
        yield store.delete(id);
        res.send(`User with id ${id} successfully deleted.`);
    }
    catch (e) {
        res.status(400);
        res.json(e);
    }
});
const authenticate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        if (firstName === undefined ||
            lastName === undefined ||
            password === undefined) {
            res.status(400);
            res.send("Some required parameters are missing! eg. :firstname, :lastname, :password");
            return false;
        }
        const tempUser = { firstName, lastName, password };
        const user = yield store.authenticateUser(tempUser);
        if (user === null) {
            res.status(401);
            res.send(`The given password is incorrect for ${firstName} ${lastName}.`);
            return false;
        }
        res.json(user);
    }
    catch (err) {
        res.status(401);
        res.json(err);
    }
});
const userRoute = (app) => {
    app.get("/users", auth_1.verifyAuthToken, index);
    app.get("/users/:id", auth_1.verifyAuthToken, show);
    app.post("/users", create);
    app.delete("/users/:id", auth_1.verifyAuthToken, deleteUser);
    app.post("/users/auth", authenticate);
};
exports.default = userRoute;
