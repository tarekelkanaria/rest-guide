"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = exports.catchError = void 0;
const catchError = (err, next) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
};
exports.catchError = catchError;
const throwError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
};
exports.throwError = throwError;
