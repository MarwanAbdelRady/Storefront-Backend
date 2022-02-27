import express, { NextFunction, Request, Response } from 'express';

import { OrderStore } from '../models/order';
import verifyAuthToken from '../middleware/auth';

const os = new OrderStore();

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, user_id: userId, order_products: orderProducts } = req.body;
    const addedOrderProducts = await os.create(status, userId, orderProducts);
    res.json(addedOrderProducts);
  } catch (err) {
    next(err);
  }
};

const orderRoutes = (app: express.Application) => {
  app.post('/orders', verifyAuthToken, create);
};

export default orderRoutes;
