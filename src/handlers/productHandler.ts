import express, { Request, Response } from "express";
import { FullProduct, ProductStore } from "../models/product";
import jwt from "jsonwebtoken";
import { verifyAuthToken } from "../middleware/auth";

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

const show = async (req: Request, res: Response) => {
  const product = await store.show(parseInt(req.params.id));
  res.json(product);
};

// const create = async (_req: Request, res: Response) => {
//   const new_product: FullProduct = {
//     product_name: _req.body.product_name,
//     price: _req.body.price,
//   };
//   try {
//     const newProduct = await store.create(new_product);
//     res.json(newProduct);
//   } catch (err) {
//     res.status(400);
//     res.json(err);
//   }
// };

const create = async (req: Request, res: Response) => {
  try {
    const product_name = req.body.product_name as unknown as string;
    const price = req.body.price as unknown as number;

    if (product_name === undefined || price === undefined) {
      res.status(400);
      res.send(
        "Some required parameters are missing! eg. :product_name, :price"
      );
      return false;
    }

    const product: FullProduct = await store.create({ product_name, price });

    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (id === undefined) {
      res.status(400);
      res.send("Missing required parameter :id.");
      return false;
    }

    await store.delete(id);

    res.send(`FullProduct with id ${id} successfully deleted.`);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const productRoute = (app: express.Application) => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", verifyAuthToken, create);
  app.delete("/products/:id", verifyAuthToken, deleteProduct);
};

export default productRoute;
