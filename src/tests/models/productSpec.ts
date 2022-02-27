/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import supertest from 'supertest';
import app from '../../server';
import { ProductStore } from '../../models/product';

const ps = new ProductStore();
const request = supertest(app);

// TODO Try to remove beforeAll
// eslint-disable-next-line no-unused-vars
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

describe('Product Model', () => {
  it('should have an index method', () => {
    expect(ps.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(ps.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(ps.create).toBeDefined();
  });

  it('create method should add a product', async () => {
    let response: unknown;

    for (let i = 0; i < 4; i++) {
      response = await ps.create('alpha', 100);
    }
    const { id, ...productData } = response as {
      id: number;
      name: string;
      price: number;
    };
    expect(productData).toEqual({
      name: 'alpha',
      price: 100
    });
  });

  it('index method should return a list of products', async () => {
    const result = await ps.index();

    result.forEach((newProduct) => {
      const { id, ...productData } = newProduct;
      expect(productData.name).toBeDefined();
      expect(productData.price).toBeDefined();
    });
  });

  it('show method should return the correct product', async () => {
    const result = await ps.show(1);
    expect(result).toEqual({
      id: 1,
      name: 'alpha',
      price: 100
    });
  });
});
