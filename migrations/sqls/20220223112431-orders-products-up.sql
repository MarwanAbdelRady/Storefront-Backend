CREATE TABLE order_products (
    quantity INTEGER,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id)
);