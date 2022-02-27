/* eslint-disable no-useless-rename */
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import appConfig from '../configuarations/appConfig';
import { UserStore } from '../models/user';
import verifyAuthToken from '../middleware/auth';

const us = new UserStore();

const index = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await us.index();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const user = await us.show(id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstname: firstName, lastname: lastName, password } = req.body;
    const newUser = await us.create(firstName, lastName, password);
    const secret: string = appConfig.secret ? appConfig.secret : 'secret';

    const token = jwt.sign(
      {
        us: {
          id: newUser.id,
          firstname: req.body.firstname,
          lastname: req.body.lastname
        }
      },
      secret
    );
    res.json(token);
  } catch (err) {
    next(err);
  }
};

const getOrdersByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.user_id);
    const orders = await us.getOrdersByUserId(userId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.get('/users/orders/:user_id', verifyAuthToken, getOrdersByUserId);
  app.post('/users', create);
};

export default userRoutes;
