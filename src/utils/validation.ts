import { Request } from "express";
import { body, validationResult } from "express-validator";
import { throwError } from "./error";
import User from "../models/user";

export const postValidation = [
  body("title")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters"),
  body("content")
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters"),
];

export const signupValidation = [
  body("name").trim().notEmpty(),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value) => {
      const userDoc = await User.findOne({ email: value });
      if (userDoc) return Promise.reject("Email address already exist");
      return Promise.resolve();
    })
    .normalizeEmail(),
  body("password", "The valid password must be at least 5 characters")
    .trim()
    .isLength({ min: 5 }),
];

export const handleValidationErrors = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwError(`Validation Failed, ${errors.array()[0].msg}`, 422);
  }
};
