import express from "express";
import { userController } from "../controllers/user.controller.js";

const router = express.Router();

// User CRUD route'lari
router.post("/", userController.create); // POST /api/users
router.put("/:id", userController.update); // PUT /api/users/:id
router.get("/", userController.findAll); // GET /api/users
router.get("/:id", userController.findOne); // GET /api/users/:id
router.delete("/:id", userController.delete); // DELETE /api/users/:id

export default router;
