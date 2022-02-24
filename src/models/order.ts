import { client } from "../database";

export interface ProductOrder {
  product_id: number;
  product_quantity: number;
}

export interface Order {
  products: ProductOrder[];
  user_id: number;
  order_status: string;
}

export interface FullOrder extends Order {
  id: number;
}

export class OrderStore {
  async index(): Promise<FullOrder[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders";

      const { rows } = await conn.query(sql);

      const productOrdersSql =
        "SELECT product_id, product_quantity FROM product_orders WHERE order_id=($1)";
      const orders = [];

      for (const order of rows) {
        const { rows: productOrderRows } = await conn.query(productOrdersSql, [
          order.id,
        ]);
        orders.push({
          ...order,
          products: productOrderRows,
        });
      }

      conn.release();

      return orders;
    } catch (err) {
      throw new Error(`Could not get orders. ${err}`);
    }
  }

  async create(order: Order): Promise<FullOrder> {
    const { products, order_status, user_id } = order;

    try {
      const sql =
        "INSERT INTO orders (user_id, order_status) VALUES($1, $2) RETURNING *";
      const conn = await client.connect();
      const { rows } = await conn.query(sql, [user_id, order_status]);
      const order = rows[0];

      const productOrdersSql =
        "INSERT INTO product_orders (order_id, product_id, product_quantity) VALUES($1, $2, $3) RETURNING product_id, product_quantity";
      const productOrders = [];

      for (const product of products) {
        const { product_id, product_quantity } = product;

        const { rows } = await conn.query(productOrdersSql, [
          order.id,
          product_id,
          product_quantity,
        ]);

        productOrders.push(rows[0]);
      }

      conn.release();

      return {
        ...order,
        products: productOrders,
      };
    } catch (err) {
      throw new Error(`Could not add new order for user ${user_id}. ${err}`);
    }
  }

  async getOrderByUserId(userId: number): Promise<FullOrder> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM orders WHERE user_id = ${userId} ORDER BY id DESC LIMIT 1;`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Cannot get the current order for the specified User ID ${err}`
      );
    }
  }

  async delete(id: number): Promise<FullOrder> {
    try {
      const conn = await client.connect();
      const productOrdersSql = "DELETE FROM product_orders WHERE order_id=($1)";
      await conn.query(productOrdersSql, [id]);

      const sql = "DELETE FROM orders WHERE id=($1)";
      const { rows } = await conn.query(sql, [id]);
      const order = rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. ${err}`);
    }
  }
}
