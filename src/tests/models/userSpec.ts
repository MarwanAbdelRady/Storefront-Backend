/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import bcrypt from 'bcrypt';
import appConfig from '../../configuarations/appConfig';
import { User, UserStore } from '../../models/user';
import { OrderStore } from '../../models/order';

const us = new UserStore();
const os = new OrderStore();
let user: User;

describe('User Model', () => {
  it('Should have an index method', () => {
    expect(us.index).toBeDefined();
  });

  it('Should have a show method', () => {
    expect(us.show).toBeDefined();
  });

  it('Should have a create method', () => {
    expect(us.create).toBeDefined();
  });

  it('Should have a get orders by user id method', () => {
    expect(us.getOrdersByUserId).toBeDefined();
  });

  it('Should create a new user', async () => {
    user = await us.create('marwan', 'abdelrady', 'password');
    const comparePassword = bcrypt.compareSync(
      `password${appConfig.pass}`,
      user.password
    );
    expect(comparePassword).toEqual(true);
    const { id, ...userData } = user;
    expect(userData).toEqual({
      firstname: 'marwan',
      lastname: 'abdelrady',
      password: userData.password
    });
  });

  it('Should return a user by their id', async () => {
    const result = await us.show(user.id as number);
    expect(result).toEqual(user);
  });

  it('Should return a list of the correct users', async () => {
    for (let i = 0; i < 4; i++) {
      await us.create('marwan', 'abdelrady', 'password');
    }
    const result = await us.index();
    const comparePassword = bcrypt.compareSync(
      `password${appConfig.pass}`,
      user.password
    );
    result.forEach((user1) => {
      const { id, ...userData } = user1;
      expect(userData.firstname).toEqual('marwan');
      expect(userData.lastname).toEqual('abdelrady');
      expect(comparePassword).toEqual(true);
    });
  });
  it('Should get an active order by user id', async () => {
    const orderProduct = { product_id: 1, quantity: 1 };
    const order = await os.create('active', 1, [orderProduct]);
    await us.getOrdersByUserId(1);
    const { id, ...orderData } = order;
    expect(orderData.user_id).toEqual(1);
    expect(orderData.status).toEqual('active');
  });
});
