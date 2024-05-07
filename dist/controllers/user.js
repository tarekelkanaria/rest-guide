"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const validation_1 = require("../utils/validation");
const error_1 = require("../utils/error");
const secrets_1 = require("../utils/secrets");
const signUp = async (req, res, next) => {
    (0, validation_1.handleValidationErrors)(req);
    const { name, email, password } = req.body;
    try {
        const hashedPass = await bcrypt_1.default.hash(password, 12);
        const user = new user_1.default({ name, email, password: hashedPass });
        const result = await user.save();
        return res
            .status(201)
            .json({ message: "New user has created", userId: result._id });
    }
    catch (err) {
        (0, error_1.catchError)(err, next);
    }
};
exports.signUp = signUp;
const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await user_1.default.findOne({ email });
        if (!user)
            (0, error_1.throwError)("Couldn't find user with this email address", 404);
        const isPasswordsEqual = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordsEqual)
            (0, error_1.throwError)("Invalid password", 401);
        const token = jsonwebtoken_1.default.sign({
            email: user.email,
            userId: user._id.toString(),
        }, secrets_1.TOKEN_SECRET, { expiresIn: "48h" });
        return res.status(200).json({ token, userId: user._id.toString() });
    }
    catch (err) {
        (0, error_1.catchError)(err, next);
    }
};
exports.login = login;
