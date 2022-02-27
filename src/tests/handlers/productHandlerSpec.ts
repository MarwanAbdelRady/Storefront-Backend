// import { ProductStore } from '../../models/product';
import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);
let token: string = '';

beforeAll((done) => {
  request
    .post('/users')
    .send({
      firstname: 'marwan',
      lastname: 'abdelrady',
      password: 'password'
    })
    .end((err: any, response: any) => {
      token = response.body;
      done();
    });
});

describe('Product Handler', () => {
  let productId: number;

  it('Should create or add a new product', async () => {
    const response = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'alpha',
        price: 100
      });
    const { id, ...result } = response.body;
    productId = id;

    expect(result).toEqual({
      name: 'alpha',
      price: 100
    });
  });

  it('Should return a list of products', async () => {
    const result = await request.get('/products');
    result.body.forEach(
      (product: { id: number; name: string; price: number }) => {
        const { id, ...productData } = product;
        expect(productData).toEqual({
          name: 'alpha',
          price: 100
        });
      }
    );
  });

  it('Should return the correct product', async () => {
    const result = await request.get(`/products/${productId}`);
    expect(result.body).toEqual({
      id: productId,
      name: 'alpha',
      price: 100
    });
  });
});
