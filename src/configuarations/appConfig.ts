import dotenv from 'dotenv';

dotenv.config();

const appConfig = {
  name: process.env.APP_NAME,
  environment: process.env.ENV,
  port: Number(process.env.PORT) || 3000,
  secret: process.env.JWT_TOKEN,
  salt: Number(process.env.SALT_ROUNDS) || 10,
  pass: process.env.BCRYPT_PASSWORD
};

export default appConfig;
