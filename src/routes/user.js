import express from "express";
import {
  userController,
  validateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// User CRUD route'lari
router.post("/", validateUser, userController.create); // POST /api/users
router.put("/:id", validateUser, userController.update); // PUT /api/users/:id
router.get("/", userController.findAll); // GET /api/users
router.get("/:id", userController.findOne); // GET /api/users/:id
router.delete("/:id", userController.delete); // DELETE /api/users/:id

export default router;
