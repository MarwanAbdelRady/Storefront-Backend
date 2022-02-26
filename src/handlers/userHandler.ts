import express, { Request, Response } from "express";
import { User, UserStore } from "../models/user";
import jwt from "jsonwebtoken";
import { process } from "../database";
import { verifyAuthToken } from "../middleware/auth";

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const user = await store.index();
  res.json(user);
};

const show = async (req: Request, res: Response) => {
  const user = await store.show(parseInt(req.params.id));
  res.json(user);
};

const create = async (_req: Request, res: Response) => {
  const user: User = {
    firstname: _req.body.firstname,
    lastname: _req.body.lastname,
    user_password: _req.body.user_password,
  };
  const newUser = await store.create(user);
  const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET);
  res.json(token);
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (id === undefined) {
      res.status(400);
      res.send("Missing required parameter :id.");
      return false;
    }

    await store.delete(id);

    res.send(`User with id ${id} successfully deleted.`);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const firstname = req.body.firstname as unknown as string;
    const lastname = req.body.lastname as unknown as string;
    const user_password = req.body.user_password as unknown as string;

    if (
      firstname === undefined ||
      lastname === undefined ||
      user_password === undefined
    ) {
      res.status(400);
      res.send(
        "Some required parameters are missing! eg. :firstname, :lastname, :user_password"
      );
      return false;
    }
    const tempUser = { firstname, lastname, user_password };
    const user: User | null = await store.authenticateUser(
      tempUser.firstname,
      tempUser.lastname,
      tempUser.user_password
    );

    if (user === null) {
      res.status(401);
      res.send(
        `The given user_password is incorrect for ${firstname} ${lastname}.`
      );

      return false;
    }

    res.json(user);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const userRoute = (app: express.Application) => {
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.post("/users", create);
  app.delete("/users/:id", verifyAuthToken, deleteUser);
  app.post("/users/auth", authenticate);
};

export default userRoute;
