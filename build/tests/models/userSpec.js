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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
var bcrypt_1 = __importDefault(require("bcrypt"));
var appConfig_1 = __importDefault(require("../../configuarations/appConfig"));
var user_1 = require("../../models/user");
var order_1 = require("../../models/order");
var us = new user_1.UserStore();
var os = new order_1.OrderStore();
var user;
describe('User Model', function () {
    it('Should have an index method', function () {
        expect(us.index).toBeDefined();
    });
    it('Should have a show method', function () {
        expect(us.show).toBeDefined();
    });
    it('Should have a create method', function () {
        expect(us.create).toBeDefined();
    });
    it('Should have a get orders by user id method', function () {
        expect(us.getOrdersByUserId).toBeDefined();
    });
    it('Should create a new user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var comparePassword, id, userData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, us.create('marwan', 'abdelrady', 'password')];
                case 1:
                    user = _a.sent();
                    comparePassword = bcrypt_1.default.compareSync("password".concat(appConfig_1.default.pass), user.password);
                    expect(comparePassword).toEqual(true);
                    id = user.id, userData = __rest(user, ["id"]);
                    expect(userData).toEqual({
                        firstname: 'marwan',
                        lastname: 'abdelrady',
                        password: userData.password
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should return a user by their id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, us.show(user.id)];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual(user);
                    return [2 /*return*/];
            }
        });
    }); });
    // it('Should return a list of users', async () => {
    //   for (let i = 0; i < 4; i++) {
    //     await us.create('marwan', 'abdelrady', 'password');
    //   }
    //   const result = await us.index();
    //   result.forEach((newUser) => {
    //     const { id, ...userData } = newUser;
    //     expect(userData.firstname).toBeDefined();
    //     expect(userData.lastname).toBeDefined();
    //     expect(userData.password).toBeDefined();
    //   });
    // });
    it('Should return a list of the correct users', function () { return __awaiter(void 0, void 0, void 0, function () {
        var i, result, comparePassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 4)) return [3 /*break*/, 4];
                    return [4 /*yield*/, us.create('marwan', 'abdelrady', 'password')];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, us.index()];
                case 5:
                    result = _a.sent();
                    comparePassword = bcrypt_1.default.compareSync("password".concat(appConfig_1.default.pass), user.password);
                    result.forEach(function (user1) {
                        var id = user1.id, userData = __rest(user1, ["id"]);
                        expect(userData.firstname).toEqual('marwan');
                        expect(userData.lastname).toEqual('abdelrady');
                        expect(comparePassword).toEqual(true);
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should get an active order by user id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var orderProduct, order, id, orderData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    orderProduct = { product_id: 1, quantity: 1 };
                    return [4 /*yield*/, os.create('active', 1, [orderProduct])];
                case 1:
                    order = _a.sent();
                    return [4 /*yield*/, us.getOrdersByUserId(1)];
                case 2:
                    _a.sent();
                    id = order.id, orderData = __rest(order, ["id"]);
                    expect(orderData.user_id).toEqual(1);
                    expect(orderData.status).toEqual('active');
                    return [2 /*return*/];
            }
        });
    }); });
});
