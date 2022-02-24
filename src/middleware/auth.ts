/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { process } from "../database";

// export function generate(data: TokenData, expiresIn?: string | number) {
//   return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn });
// }

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader: string | undefined = req.headers.authorization;
    const token = authorizationHeader ? authorizationHeader.split(" ")[1] : "";

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    res.locals.userData = decoded;
    next();
  } catch (err) {
    res.status(401);
    res.json("Access denied, invalid token");
    next(err);
  }
};
