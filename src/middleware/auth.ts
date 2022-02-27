import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import appConfig from '../configuarations/appConfig';
import { UserStore, User } from '../models/user';

const { secret } = appConfig;
const user = new UserStore();

type UserJWTPayload = {
  us: {
    id: number;
    lastname: string;
    firstname: string;
  };
  iat: number;
};

const verifyAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];

    const validJwt = jwt.verify(token, secret as string);

    if (!validJwt) {
      throw new Error();
    }
    const decoded = jwt.decode(token) as UserJWTPayload;

    const user1: User = await user.show(decoded.us.id as number);

    if (!user1) throw new Error();

    next();
  } catch (error) {
    res.status(401);
    res.json('Access denied, token is invalid.');
  }
};

export default verifyAuthToken;
