import { Router } from "express";
import { login, signUp } from "../controllers/user";
import { signupValidation } from "../utils/validation";

const router = Router();

router.put("/signup", signupValidation, signUp);

router.post("/login", login);

export default router;
