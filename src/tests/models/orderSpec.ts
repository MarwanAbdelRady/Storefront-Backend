import { Order, FullOrder, OrderStore } from "../../models/order";
import { FullUser, UserStore } from "../../models/user";
import { FullProduct, ProductStore } from "../../models/product";

const os = new OrderStore();

describe("FullOrder Model", () => {
  const us = new UserStore();
  const ps = new ProductStore();

  let order: Order, user_id: number, product_id: number;

  async function createOrder(order: Order) {
    return os.create(order);
  }

  async function deleteOrder(id: number) {
    return os.delete(id);
  }

  beforeAll(async () => {
    const user: FullUser = await us.create({
      firstname: "Hans",
      lastname: "Meier",
      user_password: "password123",
    });

    user_id = user.id;

    const product: FullProduct = await ps.create({
      product_name: "OrderSpec FullProduct",
      price: 99,
    });

    product_id = product.id;

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
    await us.delete(user_id);
    await ps.delete(product_id);
  });

  it("should have an index method", () => {
    expect(os.index).toBeDefined();
  });

  it("should have a add method", () => {
    expect(os.create).toBeDefined();
  });
  it("should have a get order by user id method", () => {
    expect(os.getOrderByUserId).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(os.delete).toBeDefined();
  });

  it("add method should add an order", async () => {
    const createdOrder: FullOrder = await createOrder(order);

    expect(createdOrder).toEqual({
      id: createdOrder.id,
      ...order,
    });

    await deleteOrder(createdOrder.id);
  });

  it("index method should return a list of orders", async () => {
    const createdOrder: FullOrder = await createOrder(order);
    const orderList = await os.index();

    expect(orderList).toEqual([createdOrder]);

    await deleteOrder(createdOrder.id);
  });

  it("delete method should remove the order", async () => {
    const createdOrder: FullOrder = await createOrder(order);

    await deleteOrder(createdOrder.id);

    const orderList = await os.index();

    expect(orderList).toEqual([]);
  });
});
