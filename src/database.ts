import { Pool } from 'pg';

import databaseConfig from './configuarations/databaseConfig';

export const client = new Pool({
  host: databaseConfig.host,
  port: databaseConfig.port as unknown as number,
  database: databaseConfig.database,
  user: databaseConfig.username,
  password: databaseConfig.password
});

export const applyParamQuery = async (sql: string, params: any) => {
  const conn = await client.connect();
  const result = await conn.query(sql, params);
  conn.release();
  return result;
};

export const applyQuery = async (sql: string) => {
  const conn = await client.connect();
  const result = await conn.query(sql);
  conn.release();
  return result;
};
