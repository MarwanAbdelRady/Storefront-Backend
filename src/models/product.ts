/* eslint-disable prettier/prettier */
import { client } from "../database";

export interface Product {
  product_name: string;
  price: number;
}

export interface FullProduct extends Product {
  id: number;
}

export class ProductStore {
  async index(): Promise<FullProduct[]> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM products;`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get products ${err}`);
    }
  }

  async show(productId: number): Promise<FullProduct> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM products WHERE id=$1;`;
      const result = await conn.query(sql, [productId]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Product with this ID could not be found. Error ${err}`);
    }
  }

  async create(p: Product): Promise<FullProduct> {
    try {
      const { product_name, price } = p;
      const conn = await client.connect();
      const sql = `INSERT INTO products(product_name, price) VALUES($1, $2) RETURNING *;`;
      const result = await conn.query(sql, [product_name, price]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Product could not be created. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<FullProduct> {
    try {
      const sql = "DELETE FROM products WHERE id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete product ${id}. ${err}`);
    }
  }
}
