/* eslint-disable prettier/prettier */
import { client, process } from "../database";
import bcrypt from "bcrypt";
import { Client } from "pg";

export interface User {
  firstName: string;
  lastName: string;
  password: string;
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
      const { firstName, lastName, password } = u;
      const conn = await client.connect();
      const sql = `INSERT INTO users (firstname, lastname, user_password) VALUES($1, $2, $3) RETURNING *;`;
      const hash = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
      const result = await conn.query(sql, [firstName, lastName, hash]);
      conn.release();
      if (result.rows[0] === undefined) {
        throw new Error("undefined user");
      }
      return result.rows[0];
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
  async authenticateUser(u: User): Promise<FullUser | null> {
    try {
      const { firstName, lastName, password } = u;
      console.log(firstName);
      const sql = "SELECT * FROM users WHERE firstname=$1 AND lastname=$2;";
      const connection = await client.connect();
      const { rows } = await connection.query(sql, [
        firstName,
        lastName,
        password,
      ]);
      console.log("ugyrtdcvbn" + rows.length);
      if (rows.length > 0) {
        const user = rows[0];
        console.log("dunsd" + user.user_password);
        if (
          bcrypt.compareSync(
            password + process.env.BCRYPT_PASSWORD,
            user.user_password
          )
        ) {
          return user;
        }
      }

      connection.release();

      return null;
    } catch (err) {
      throw new Error(`Could not find user ${u.firstName}. ${err}`);
    }
  }
}
