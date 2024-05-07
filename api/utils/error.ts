import type { NextFunction } from "express";

export const catchError = (
  err: Error & { statusCode?: number },
  next: NextFunction
) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};

export const throwError = (message: string, statusCode: number) => {
  const error: Error & { statusCode?: number } = new Error(message);
  error.statusCode = statusCode;
  throw error;
};
