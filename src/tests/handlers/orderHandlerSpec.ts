import supertest from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../../server";
import { Order } from "../../models/order";
import { User } from "../../models/user";
import { Product } from "../../models/product";

const request = supertest(app);

describe("Order Handler", () => {
  let token: string,
    order: Order,
    user_id: number,
    product_id: number,
    order_id: number;

  beforeAll(async () => {
    const userData: User = {
      firstname: "Order",
      lastname: "Tester",
      user_password: "password123",
    };
    const productData: Product = {
      product_name: "CodeMaster 199",
      price: 199,
    };

    const { body: userBody } = await request.post("/users").send(userData);

    token = userBody;

    // @ts-ignore
    const { user } = jwt.verify(token, process.env.TOKEN_SECRET);
    user_id = user.id;

    const { body: productBody } = await request
      .post("/products")
      .set("Authorization", "bearer " + token)
      .send(productData);
    product_id = productBody.id;

    order = {
      products: [
        {
          product_id,
          product_quantity: 5,
        },
      ],
      user_id,
      order_status: "complete",
    };
  });

  afterAll(async () => {
    await request
      .delete(`/users/${user_id}`)
      .set("Authorization", "bearer " + token);
    await request
      .delete(`/products/${product_id}`)
      .set("Authorization", "bearer " + token);
  });

  it("gets the create endpoint", (done) => {
    request
      .post("/orders")
      .send(order)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        const { body, status } = res;

        expect(status).toBe(200);

        order_id = body.id;

        done();
      });
  });

  it("gets the order by user id endpoint", (done) => {
    request
      .get(`/orders/${user_id}`)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it("gets the delete endpoint", (done) => {
    request
      .delete(`/orders/${order_id}`)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
