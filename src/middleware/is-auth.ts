import jwt, { type JwtPayload } from "jsonwebtoken";
import { catchError, throwError } from "../utils/error";
import { TOKEN_SECRET } from "../utils/secrets";
import type { NextFunction, Response } from "express";
import type { ExtendedRequest } from "../types";

export const isAuth = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) throwError("Not authorized", 401);
  const token = authHeader!.split(" ")[1];
  let decodedToken: string | JwtPayload | null = null;
  try {
    decodedToken = jwt.verify(token, TOKEN_SECRET);
  } catch (err) {
    catchError(err as Error & { statusCode?: number }, next);
  }
  if (!decodedToken) throwError("Not authorized", 401);
  req.userId = (decodedToken! as JwtPayload).userId;
  next();
};
