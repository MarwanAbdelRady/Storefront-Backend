import express, { Request, Response, NextFunction } from 'express';
import { ProductStore } from '../models/product';
import verifyAuthToken from '../middleware/auth';

const ps = new ProductStore();

const index = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await ps.index();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const product = await ps.show(id);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price } = req.body;
    const newProduct = await ps.create(name, price);
    res.json(newProduct);
  } catch (err) {
    next(err);
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
};

export default productRoutes;
