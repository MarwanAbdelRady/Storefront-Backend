import { Order, OrderStore } from '../../models/order';

const os = new OrderStore();
let order: Order;

describe('Order Model', () => {
  it('Should have a create method', () => {
    expect(os.create).toBeDefined();
  });

  it('Should create a new order', async () => {
    const orderProduct = { product_id: 1, quantity: 1 };
    order = await os.create('complete', 3, [orderProduct]);
    expect(order).toEqual({
      id: order.id,
      status: 'complete',
      user_id: 3
    });
  });
});
