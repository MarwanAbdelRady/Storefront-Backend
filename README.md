# Storefront-Backend

## Prerequisites

- node: v12 or higher
- npm: v6 or higher
- postgreSQL: v14 or higher

1. Install project dependencies

```shell
npm install
```

2. Create a `.env` file in the prooject folder and add the following to it:

```bash
ENV=dev
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=shopping_user
POSTGRES_PASSWORD=password123
POSTGRES_DB=shopping
POSTGRES_TEST_DB=shopping_test
BCRYPT_PASSWORD=password123
SALT_ROUNDS=10
JWT_TOKEN=secret
```
3. open the **cmd** on your machine and type `psql -U postgres` or its default configurations.  
4. Next, create a user with superuser privileges and create two databases, one for development and another for testing.

```shell
CREATE USER user_shop WITH PASSWORD 'password123' SUPERUSER;
```

```shell
CREATE DATABASE shop OWNER user_shop;
CREATE DATABASE shop_test OWNER user_shop;
```

5. `npm install db-migrate` and run db-migrate to setup the database.

```shell
db-migrate up
```
6. Compile the Typescript project to Javascipt using:
```npm run build```

7. Use prettier by `npm run pretty` & eslint by `npm run lint`

8. To run the unit testing of the project:
```npm run test```

9. You can run project using `npm start` to run it on the localhost on port **3000**

## Author

### Marwan Abdelrady
