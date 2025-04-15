import express from "express";
import {
  authController,
  validateSignUp,
  validateSignIn,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Auth route'lari
router.post("/signup", validateSignUp, authController.signUp); // POST /api/auth/signup
router.post("/signin", validateSignIn, authController.signIn); // POST /api/auth/signin

export default router;
