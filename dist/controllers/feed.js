"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPost = exports.createPost = exports.getPosts = void 0;
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
const clear_image_1 = require("../utils/clear-image");
const error_1 = require("../utils/error");
const image_relative_path_1 = require("../utils/image-relative-path");
const validation_1 = require("../utils/validation");
const getPosts = async (req, res, next) => {
    const currentPage = +req.query.page || 1;
    const perPage = 2;
    let totalItems = 0;
    try {
        totalItems = await post_1.default.find().countDocuments();
        const posts = await post_1.default.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        res
            .status(200)
            .json({ message: "Posts found successfully", posts, totalItems });
    }
    catch (err) {
        (0, error_1.catchError)(err, next);
    }
};
exports.getPosts = getPosts;
const createPost = async (req, res, next) => {
    const { title, content } = req.body;
    (0, validation_1.handleValidationErrors)(req);
    if (!req.file) {
        (0, error_1.throwError)("Validation Failed, no image Provided", 422);
    }
    const imagePath = req.file.path;
    const imageUrl = (0, image_relative_path_1.imageRelativePath)(imagePath);
    const post = new post_1.default({
        title,
        content,
        imageUrl,
        creator: req.userId,
    });
    try {
        const createdPost = await post.save();
        const user = await user_1.default.findById(req.userId);
        if (!user)
            (0, error_1.throwError)("Unauthorized", 401);
        user.posts.push(createdPost);
        await user.save();
        return res.status(201).json({
            message: "Post added successfully",
            post: createdPost,
            creator: { _id: user._id, name: user.name },
        });
    }
    catch (err) {
        (0, error_1.catchError)(err, next);
    }
};
exports.createPost = createPost;
const getPost = async (req, res, next) => {
    const { postId } = req.params;
    try {
        const post = await post_1.default.findById(postId);
        if (!post) {
            (0, error_1.throwError)(`Could not find post`, 404);
        }
        res.status(200).json({ message: "Post found successfully", post });
    }
    catch (err) {
        (0, error_1.catchError)(err, next);
    }
};
exports.getPost = getPost;
const updatePost = async (req, res, next) => {
    const { postId } = req.params;
    (0, validation_1.handleValidationErrors)(req);
    const { title, content } = req.body;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = (0, image_relative_path_1.imageRelativePath)(req.file.path);
    }
    if (!imageUrl) {
        (0, error_1.throwError)("Validation Failed, no image Provided", 422);
    }
    try {
        const post = await post_1.default.findById(postId);
        if (!post)
            (0, error_1.throwError)(`Could not find post`, 404);
        if (post.creator.toString() !== req.userId) {
            (0, error_1.throwError)("Unauthorized", 403);
        }
        if (post.imageUrl !== imageUrl) {
            (0, clear_image_1.clearImage)(post.imageUrl.substring(post.imageUrl.lastIndexOf("/") + 1));
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        const updatedPost = await post?.save();
        res
            .status(200)
            .json({ message: "Post Updated successfully", post: updatedPost });
    }
    catch (err) {
        (0, error_1.catchError)(err, next);
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res, next) => {
    const { postId } = req.params;
    try {
        const post = await post_1.default.findById(postId);
        if (!post)
            (0, error_1.throwError)(`Could not find post`, 404);
        if (post.creator.toString() !== req.userId) {
            (0, error_1.throwError)("Unauthorized", 403);
        }
        (0, clear_image_1.clearImage)(post.imageUrl.substring(post.imageUrl.lastIndexOf("/") + 1));
        await post_1.default.findByIdAndDelete(postId);
        const user = await user_1.default.findById(req.userId);
        user?.posts.pull(postId);
        return user?.save();
    }
    catch (err) {
        (0, error_1.catchError)(err, next);
    }
};
exports.deletePost = deletePost;
