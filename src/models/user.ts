/* eslint-disable prettier/prettier */
import { client, process } from "../database";
import bcrypt from "bcrypt";

export interface User {
  firstname: string;
  lastname: string;
  user_password: string;
}

export interface FullUser extends User {
  id: number;
}

export class UserStore {
  async index(): Promise<FullUser[]> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM users;`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get users ${err}`);
    }
  }

  async show(userId: number): Promise<FullUser> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM users WHERE id=$1;`;
      const result = await conn.query(sql, [userId]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`User with this ID could not be found. Error ${err}`);
    }
  }

  async create(u: User): Promise<FullUser> {
    try {
      const { firstname, lastname, user_password } = u;
      const conn = await client.connect();
      const sql = `INSERT INTO users (firstname, lastname, user_password) VALUES($1, $2, $3) RETURNING *`;
      const hash = bcrypt.hashSync(
        user_password + process.env.BCRYPT_PASSWORD,
        parseInt(process.env.SALT_ROUNDS as string, 10)
      );
      const { rows } = await conn.query(sql, [firstname, lastname, hash]);
      conn.release();
      // if (result.rows[0] === undefined) {
      //   throw new Error("undefined user");
      // }
      return rows[0];
    } catch (err) {
      throw new Error(`User could not be created. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const sql = "DELETE FROM users WHERE id=($1)";
      const conn = await client.connect();
      await conn.query(sql, [id]);
      conn.release();
      return true;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. ${err}`);
    }
  }
  async authenticateUser(
    firstname: string,
    lastname: string,
    user_password: string
  ): Promise<FullUser | null> {
    try {
      // const { firstname, lastname, user_password } = u;
      const sql = "SELECT * FROM users WHERE firstname=($1) AND lastname=($2);";
      const connection = await client.connect();
      const { rows } = await connection.query(sql, [firstname, lastname]);
      if (rows.length > 0) {
        const user = rows[0];
        if (
          bcrypt.compareSync(
            user_password + process.env.BCRYPT_PASSWORD,
            user.user_password
          )
        ) {
          return user;
        }
      }

      connection.release();

      return null;
    } catch (err) {
      throw new Error(`Could not find user ${firstname}. ${err}`);
    }
  }
}
