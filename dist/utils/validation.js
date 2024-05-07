"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.signupValidation = exports.postValidation = void 0;
const express_validator_1 = require("express-validator");
const error_1 = require("./error");
const user_1 = __importDefault(require("../models/user"));
exports.postValidation = [
    (0, express_validator_1.body)("title")
        .isLength({ min: 5 })
        .withMessage("Title must be at least 5 characters"),
    (0, express_validator_1.body)("content")
        .isLength({ min: 5 })
        .withMessage("Content must be at least 5 characters"),
];
exports.signupValidation = [
    (0, express_validator_1.body)("name").trim().notEmpty(),
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom(async (value) => {
        const userDoc = await user_1.default.findOne({ email: value });
        if (userDoc)
            return Promise.reject("Email address already exist");
        return Promise.resolve();
    })
        .normalizeEmail(),
    (0, express_validator_1.body)("password", "The valid password must be at least 5 characters")
        .trim()
        .isLength({ min: 5 }),
];
const handleValidationErrors = (req) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        (0, error_1.throwError)(`Validation Failed, ${errors.array()[0].msg}`, 422);
    }
};
exports.handleValidationErrors = handleValidationErrors;
