import supertest from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import app from '../../server';
import appConfig from '../../configuarations/appConfig';

const request = supertest(app);
let userId: string | number;
let token: string = '';

describe('User Handler', () => {
  it('Should create or add a new user', async () => {
    const result = await request.post('/users').send({
      firstname: 'marwan',
      lastname: 'abdelrady',
      password: 'password'
    });
    token = result.body;
    const decoded = jwt.verify(token, appConfig.secret as string) as {
      us: { id: number; firstname: string; lastname: string };
    };
    const { id, ...userData } = decoded.us;
    userId = id;

    expect(userData).toEqual({
      firstname: 'marwan',
      lastname: 'abdelrady'
    });
  });

  it('Should display a user by their id', async () => {
    const result = await request
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    const comparePassword = bcrypt.compareSync(
      `password${appConfig.pass}`,
      result.body.password
    );
    expect(comparePassword).toEqual(true);
    expect(result.body).toEqual({
      id: userId,
      firstname: 'marwan',
      lastname: 'abdelrady',
      password: result.body.password
    });
  });

  it('Should display user orders', async () => {
    let product: { id: number };

    await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'alpha',
        price: 100
      })
      .then((response) => {
        product = response.body;
      })
      .then(() => {
        request
          .post('/orders')
          .set('Authorization', `Bearer ${token}`)
          .send({
            status: 'active',
            user_id: userId,
            order_products: [
              {
                product_id: product.id,
                quantity: 1
              }
            ]
          });
      });

    const response = await request
      .get(`/users/orders/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
  });

  it('Displays users with no valid tokens', async () => {
    const result = await request
      .get(`/users`)
      .set('Authorization', `InValidToken`);
    expect(result.status).toBe(401);
  });
});
