"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../utils/error");
const secrets_1 = require("../utils/secrets");
const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader)
        (0, error_1.throwError)("Not authorized", 401);
    const token = authHeader.split(" ")[1];
    let decodedToken = null;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, secrets_1.TOKEN_SECRET);
    }
    catch (err) {
        (0, error_1.catchError)(err, next);
    }
    if (!decodedToken)
        (0, error_1.throwError)("Not authorized", 401);
    req.userId = decodedToken.userId;
    next();
};
exports.isAuth = isAuth;
