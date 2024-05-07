"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearImage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const clearImage = (imageName) => {
    const filePath = path_1.default.join(__dirname, "..", "..", "public", "images", imageName);
    fs_1.default.unlink(filePath, (err) => console.log(err));
};
exports.clearImage = clearImage;
