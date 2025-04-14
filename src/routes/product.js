import express from "express";
import { productController } from "../controllers/product.controller.js";

const router = express.Router();

// Product CRUD route'lari
router.post("/", productController.create); // POST /api/products
router.put("/:id", productController.update); // PUT /api/products/:id
router.get("/", productController.findAll); // GET /api/products
router.get("/:id", productController.findOne); // GET /api/products/:id
router.delete("/:id", productController.delete); // DELETE /api/products/:id

export default router;
