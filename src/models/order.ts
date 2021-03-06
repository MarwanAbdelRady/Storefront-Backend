/* eslint-disable class-methods-use-this */
import format from 'pg-format';

import { applyQuery, applyParamQuery } from '../database';

export type Order = {
  id: Number;
  user_id: Number;
  status: string;
};

export type OrderProducts = {
  product_id: Number;
  quantity: number;
  order_id?: undefined | number;
};

export class OrderStore {
  async create(
    status: string,
    userId: number,
    orderProducts: OrderProducts[]
  ): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
      const result = await applyParamQuery(sql, [status, userId]);

      const orderProductsData = orderProducts.map((orderProduct) => [
        orderProduct.product_id,
        orderProduct.quantity,
        result.rows[0].id
      ]);

      await applyQuery(
        format(
          'INSERT INTO order_products (product_id, quantity, order_id) VALUES %L',
          orderProductsData
        )
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(`Order could not be created. Error: ${err}`);
    }
  }
}
