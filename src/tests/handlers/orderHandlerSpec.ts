import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { User } from '../../models/user';
import app from '../../server';
import { Product } from '../../models/product';
import appConfig from '../../configuarations/appConfig';

const request = supertest(app);
let user: User;
let product: Product;
let token: string = '';

beforeAll(async () => {
  await request
    .post('/users')
    .send({
      firstName: 'marwan',
      lastName: 'abdelrady',
      password: 'password'
    })
    .then((response) => {
      token = response.body;
      const decoded = jwt.verify(token, appConfig.secret as string) as {
        us: {
          id: number;
          firstname: string;
          lastname: string;
          password: string;
        };
      };
      user = decoded.us;
    });
  await request
    .post('/products')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'alpha',
      price: 100
    })
    .then((response) => {
      product = response.body;
    });
});

describe('Order Handler', () => {
  it('Should add a new order of prducts', async () => {
    const response = await request
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'active',
        user_id: user.id,
        order_products: [
          {
            product_id: product.id,
            quantity: 1
          }
        ]
      });
    expect(response.status).toEqual(200);
  });
});
