/* eslint-disable class-methods-use-this */
import bcrypt from 'bcrypt';
import { applyQuery, applyParamQuery } from '../database';
import appConfig from '../configuarations/appConfig';
import { Order } from './order';

export type User = {
  id: Number;
  firstname: string;
  lastname: string;
  password: string;
};

const SALT_ROUNDS = appConfig.salt;
const BCRYPT_PASSWORD = appConfig.pass;

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const sql = 'SELECT * FROM users';
      const result = await applyQuery(sql);
      return result.rows;
    } catch (err) {
      throw new Error(`Users could not be found. Error: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await applyParamQuery(sql, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Couldn't find user. Error: ${err}`);
    }
  }

  async create(
    firstName: string,
    lastName: string,
    password: string
  ): Promise<User> {
    try {
      const salt = SALT_ROUNDS ? Number(SALT_ROUNDS) : 10;
      const hash = bcrypt.hashSync(password + BCRYPT_PASSWORD, salt);
      const sql =
        'INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *';
      const result = await applyParamQuery(sql, [firstName, lastName, hash]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`User could not be created. Error: ${err}`);
    }
  }

  async getOrdersByUserId(userId: number): Promise<Order> {
    try {
      const sql = `SELECT orders.id, orders.status, order_products.quantity
        FROM orders
        JOIN order_products ON orders.id = order_products.order_id
        where orders.user_id = ($1) and orders.status = 'active'`;

      const result = await applyParamQuery(sql, [userId]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Couldn't get orders. Error: ${err}`);
    }
  }
}
