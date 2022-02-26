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
exports.UserStore = void 0;
/* eslint-disable prettier/prettier */
const database_1 = require("../database");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserStore {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.client.connect();
                const sql = `SELECT * FROM users;`;
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`Cannot get users ${err}`);
            }
        });
    }
    show(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.client.connect();
                const sql = `SELECT * FROM users WHERE id=$1;`;
                const result = yield conn.query(sql, [userId]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`User with this ID could not be found. Error ${err}`);
            }
        });
    }
    create(u) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstname, lastname, user_password } = u;
                const conn = yield database_1.client.connect();
                const sql = `INSERT INTO users (firstname, lastname, user_password) VALUES($1, $2, $3) RETURNING *`;
                const hash = bcrypt_1.default.hashSync(user_password + database_1.process.env.BCRYPT_PASSWORD, parseInt(database_1.process.env.SALT_ROUNDS, 10));
                const { rows } = yield conn.query(sql, [firstname, lastname, hash]);
                conn.release();
                // if (result.rows[0] === undefined) {
                //   throw new Error("undefined user");
                // }
                return rows[0];
            }
            catch (err) {
                throw new Error(`User could not be created. Error: ${err}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = "DELETE FROM users WHERE id=($1)";
                const conn = yield database_1.client.connect();
                yield conn.query(sql, [id]);
                conn.release();
                return true;
            }
            catch (err) {
                throw new Error(`Could not delete user ${id}. ${err}`);
            }
        });
    }
    authenticateUser(firstname, lastname, user_password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const { firstname, lastname, user_password } = u;
                const sql = "SELECT * FROM users WHERE firstname=($1) AND lastname=($2);";
                const connection = yield database_1.client.connect();
                const { rows } = yield connection.query(sql, [firstname, lastname]);
                if (rows.length > 0) {
                    const user = rows[0];
                    if (bcrypt_1.default.compareSync(user_password + database_1.process.env.BCRYPT_PASSWORD, user.user_password)) {
                        return user;
                    }
                }
                connection.release();
                return null;
            }
            catch (err) {
                throw new Error(`Could not find user ${firstname}. ${err}`);
            }
        });
    }
}
exports.UserStore = UserStore;
