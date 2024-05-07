"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRelativePath = void 0;
const imageRelativePath = (imagePath) => {
    return `images/${imagePath.substring(imagePath.lastIndexOf("\\") + 1)}`;
};
exports.imageRelativePath = imageRelativePath;
