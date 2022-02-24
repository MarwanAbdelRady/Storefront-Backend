import express, { Request, Response } from "express";
import { FullOrder, OrderStore, ProductOrder } from "../models/order";
import { verifyAuthToken } from "../middleware/auth";

const store = new OrderStore();

const show = async (req: Request, res: Response) => {
  const order = await store.getOrderByUserId(parseInt(req.params.userId));
  res.json(order);
};

const create = async (req: Request, res: Response) => {
  try {
    const products = req.body.products as unknown as ProductOrder[];
    const order_status = req.body.order_status as unknown as string;
    const user_id = req.body.user_id as unknown as number;

    if (
      products === undefined ||
      order_status === undefined ||
      user_id === undefined
    ) {
      res.status(400);
      res.send(
        "Some required parameters are missing! eg. :products, :order_status, :user_id"
      );
      return false;
    }

    const order: FullOrder = await store.create({
      products,
      order_status,
      user_id,
    });

    res.json(order);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number;

    if (id === undefined) {
      res.status(400);
      res.send("Missing required parameter :id.");
      return false;
    }

    await store.delete(id);

    res.send(`FullOrder with id ${id} successfully deleted.`);
  } catch (e) {
    res.status(400);
    res.json(e);
  }
};
const orderRoute = (app: express.Application) => {
  app.get("orders/:userId", show);
  app.post("/orders", verifyAuthToken, create);
  app.delete("/orders/:id", verifyAuthToken, deleteOrder);
};

export default orderRoute;
