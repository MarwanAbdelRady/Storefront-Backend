import supertest from "supertest";
import jwt, { Secret } from "jsonwebtoken";

import { app } from "../../server";
import { User } from "../../models/user";

const request = supertest(app);
const SECRET = process.env.TOKEN_SECRET as Secret;

describe("User Handler", () => {
  const userData: User = {
    firstname: "Hans",
    lastname: "Meier",
    user_password: "password123",
  };

  let token: string,
    userId: number = 1;

  it("should require authorization on every endpoint", (done) => {
    request.get("/users").then((res) => {
      expect(res.status).toBe(401);
      done();
    });

    request.get(`/users/${userId}`).then((res) => {
      expect(res.status).toBe(401);
      done();
    });

    request.delete(`/users/${userId}`).then((res) => {
      expect(res.status).toBe(401);
      done();
    });
  });

  it("gets the create endpoint", (done) => {
    request
      .post("/users")
      .send(userData)
      .then((res) => {
        const { body, status } = res;
        token = body;

        // @ts-ignore
        const { user } = jwt.verify(token, SECRET);
        userId = user.id;

        expect(status).toBe(200);
        done();
      });
  });

  it("gets the index endpoint", (done) => {
    request
      .get("/users")
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it("gets the read endpoint", (done) => {
    request
      .get(`/users/${userId}`)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it("gets the auth endpoint", (done) => {
    request
      .post("/users/auth")
      .send({
        firstname: userData.firstname,
        lastname: userData.lastname,
        user_password: userData.user_password,
      })
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it("gets the auth endpoint with wrong user_password", (done) => {
    request
      .post("/users/auth")
      .send({
        firstname: userData.firstname,
        lastname: userData.lastname,
        user_password: "falsepassword",
      })
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(401);
        done();
      });
  });

  it("gets the delete endpoint", (done) => {
    request
      .delete(`/users/${userId}`)
      .set("Authorization", "bearer " + token)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
