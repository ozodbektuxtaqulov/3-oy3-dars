import express from "express";
import { categoryController } from "../controllers/category.controller.js";

const router = express.Router();

// Category CRUD route'lari
router.post("/", categoryController.create); // POST /api/categories
router.put("/:id", categoryController.update); // PUT /api/categories/:id
router.get("/", categoryController.findAll); // GET /api/categories
router.get("/:id", categoryController.findOne); // GET /api/categories/:id
router.delete("/:id", categoryController.delete); // DELETE /api/categories/:id

export default router;
