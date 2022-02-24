import supertest from "supertest";
import jwt, { Secret } from "jsonwebtoken";

import { app } from "../../server";
import { Product } from "../../models/product";
import { User, FullUser } from "../../models/user";
import { process } from "../../database";

const request = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe("Product Handler", () => {
  const product: Product = {
    product_name: "CodeMaster 3000",
    price: 999,
  };

  let token: string, userId: number, productId: number;

  beforeAll(async () => {
    const userData: User = {
      firstName: "Produkt",
      lastName: "Tester",
      password: "password123",
    };

    const { body } = await request.post("/users").send(userData);

    token = body;
    // @ts-ignore
    const { user } = jwt.verify(token, process.env.TOKEN_SECRET);
    userId = user.id;
  });

  afterAll(async () => {
    await request
      .delete(`/users/${userId}`)
      .set("Authorization", "bearer " + token);
  });

  it("gets the create endpoint", (done) => {
    request
      .post("/products")
      .send(product)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        const { body, status } = res;

        expect(status).toBe(200);

        productId = body.id;
        done();
      });
  });

  it("gets the index endpoint", (done) => {
    request.get("/products").then((res) => {
      expect(res.status).toBe(200);
      done();
    });
  });

  it("gets the read endpoint", (done) => {
    request.get(`/products/${productId}`).then((res) => {
      expect(res.status).toBe(200);
      done();
    });
  });

  it("gets the delete endpoint", (done) => {
    request
      .delete(`/products/${productId}`)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
