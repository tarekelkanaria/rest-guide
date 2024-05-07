import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/feed";
import { postValidation } from "../utils/validation";
import { isAuth } from "../middleware/is-auth";

const router = Router();

// GET /feed/posts
router.get("/posts", isAuth, getPosts);

// POST /feed/post
router.post("/post", isAuth, postValidation, createPost);

router.get("/post/:postId", isAuth, getPost);

router.put("/post/:postId", isAuth, postValidation, updatePost);

router.delete("/post/:postId", isAuth, deletePost);

export default router;
