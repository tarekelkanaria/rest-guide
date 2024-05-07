import Post from "../models/post";
import User from "../models/user";
import { ExtendedRequest } from "../types";
import { clearImage } from "../utils/clear-image";
import { catchError, throwError } from "../utils/error";
import { imageRelativePath } from "../utils/image-relative-path";
import { handleValidationErrors } from "../utils/validation";
import type { NextFunction, Request, Response } from "express";

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentPage = +req.query.page! || 1;
  const perPage = 2;
  let totalItems = 0;

  try {
    totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res
      .status(200)
      .json({ message: "Posts found successfully", posts, totalItems });
  } catch (err) {
    catchError(err as Error & { statusCode?: number }, next);
  }
};

export const createPost = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const { title, content } = req.body;
  handleValidationErrors(req);

  if (!req.file) {
    throwError("Validation Failed, no image Provided", 422);
  }
  const imagePath = req.file!.path;

  const imageUrl = imageRelativePath(imagePath);

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: req.userId,
  });
  try {
    const createdPost = await post.save();
    const user = await User.findById(req.userId);
    if (!user) throwError("Unauthorized", 401);
    user!.posts.push(createdPost);
    await user!.save();
    return res.status(201).json({
      message: "Post added successfully",
      post: createdPost,
      creator: { _id: user!._id, name: user!.name },
    });
  } catch (err) {
    catchError(err as Error & { statusCode?: number }, next);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throwError(`Could not find post`, 404);
    }
    res.status(200).json({ message: "Post found successfully", post });
  } catch (err) {
    catchError(err as Error & { statusCode?: number }, next);
  }
};

export const updatePost = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;
  handleValidationErrors(req);

  const { title, content } = req.body;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = imageRelativePath(req.file.path);
  }

  if (!imageUrl) {
    throwError("Validation Failed, no image Provided", 422);
  }
  try {
    const post = await Post.findById(postId);
    if (!post) throwError(`Could not find post`, 404);
    if (post!.creator.toString() !== req.userId) {
      throwError("Unauthorized", 403);
    }
    if (post!.imageUrl !== imageUrl) {
      clearImage(post!.imageUrl.substring(post!.imageUrl.lastIndexOf("/") + 1));
    }
    post!.title = title;
    post!.content = content;
    post!.imageUrl = imageUrl;
    const updatedPost = await post?.save();
    res
      .status(200)
      .json({ message: "Post Updated successfully", post: updatedPost });
  } catch (err) {
    catchError(err as Error & { statusCode?: number }, next);
  }
};

export const deletePost = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) throwError(`Could not find post`, 404);
    if (post!.creator.toString() !== req.userId) {
      throwError("Unauthorized", 403);
    }
    clearImage(post!.imageUrl.substring(post!.imageUrl.lastIndexOf("/") + 1));
    await Post.findByIdAndDelete(postId);
    const user = await User.findById(req.userId);
    user?.posts.pull(postId);
    return user?.save();
  } catch (err) {
    catchError(err as Error & { statusCode?: number }, next);
  }
};
