import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { handleValidationErrors } from "../utils/validation";
import { catchError, throwError } from "../utils/error";
import { TOKEN_SECRET } from "../utils/secrets";
import type { NextFunction, Request, Response } from "express";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  handleValidationErrors(req);
  const { name, email, password } = req.body;
  try {
    const hashedPass = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPass });
    const result = await user.save();
    return res
      .status(201)
      .json({ message: "New user has created", userId: result._id });
  } catch (err) {
    catchError(err as Error & { statusCode?: number }, next);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throwError("Couldn't find user with this email address", 404);
    const isPasswordsEqual = await bcrypt.compare(
      password,
      user!.password as string
    );
    if (!isPasswordsEqual) throwError("Invalid password", 401);
    const token = jwt.sign(
      {
        email: user!.email,
        userId: user!._id.toString(),
      },
      TOKEN_SECRET,
      { expiresIn: "48h" }
    );
    return res.status(200).json({ token, userId: user!._id.toString() });
  } catch (err) {
    catchError(err as Error & { statusCode: number }, next);
  }
};
