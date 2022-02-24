CREATE TABLE product_orders (
  order_id   INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  product_quantity   INTEGER NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);