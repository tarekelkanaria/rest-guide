"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.put("/signup", validation_1.signupValidation, user_1.signUp);
router.post("/login", user_1.login);
exports.default = router;
