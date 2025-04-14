import express from "express";
import { authController } from "../controllers/auth.controller.js";

const router = express.Router();

// Auth route'lari
router.post("/signup", authController.signUp); // POST /api/auth/signup
router.post("/signin", authController.signIn); // POST /api/auth/signin

export default router;
