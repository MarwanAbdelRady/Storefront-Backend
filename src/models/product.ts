/* eslint-disable class-methods-use-this */
import { applyQuery, applyParamQuery } from '../database';

export type Product = {
  id: Number;
  name: string;
  price: number;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const sql = 'SELECT * FROM products';
      const result = await applyQuery(sql);
      return result.rows;
    } catch (err) {
      throw new Error(`Products could not be found. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await applyParamQuery(sql, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find the specified product. Error: ${err}`);
    }
  }

  async create(name: string, price: number): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *';
      const result = await applyParamQuery(sql, [name, price]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Product could not be created. Error: ${err}`);
    }
  }
}
