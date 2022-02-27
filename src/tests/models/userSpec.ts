/* eslint-disable no-await-in-loop */
import bcrypt from 'bcrypt';
import appConfig from '../../configuarations/appConfig';
import { User, UserStore } from '../../models/user';

const us = new UserStore();
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

  it('Should create a new user', async () => {
    user = await us.create('Marwan', 'Abdelrady', 'password');
    const comparePassword = bcrypt.compareSync(
      `password${appConfig.pass}`,
      user.password
    );
    expect(comparePassword).toEqual(true);
    const { id, ...testUser } = user;
    expect(testUser).toEqual({
      firstname: 'Marwan',
      lastname: 'Abdelrady',
      password: testUser.password
    });
  });

  it('Should return a user by their id', async () => {
    const result = await us.show(user.id as number);
    expect(result).toEqual(user);
  });

  it('Should return a list of users', async () => {
    for (let i = 0; i < 4; i++) {
      await us.create('Marwan', 'Abdelrady', 'password');
    }
    const result = await us.index();

    result.forEach((newUser) => {
      const { id, ...userData } = newUser;
      expect(userData.firstname).toBeDefined();
      expect(userData.lastname).toBeDefined();
      expect(userData.password).toBeDefined();
    });
  });
});
