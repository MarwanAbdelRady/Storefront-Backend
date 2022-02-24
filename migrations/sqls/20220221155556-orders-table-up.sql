CREATE TYPE statustype AS ENUM ('active', 'complete');

CREATE TABLE orders (
    id SERIAL PRIMARY KEY, 
    user_id INTEGER,
    order_status statustype NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);