"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feed_1 = require("../controllers/feed");
const validation_1 = require("../utils/validation");
const is_auth_1 = require("../middleware/is-auth");
const router = (0, express_1.Router)();
// GET /feed/posts
router.get("/posts", is_auth_1.isAuth, feed_1.getPosts);
// POST /feed/post
router.post("/post", is_auth_1.isAuth, validation_1.postValidation, feed_1.createPost);
router.get("/post/:postId", is_auth_1.isAuth, feed_1.getPost);
router.put("/post/:postId", is_auth_1.isAuth, validation_1.postValidation, feed_1.updatePost);
router.delete("/post/:postId", is_auth_1.isAuth, feed_1.deletePost);
exports.default = router;
