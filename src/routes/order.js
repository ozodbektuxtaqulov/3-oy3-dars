import express from "express";
import {
  orderController,
  validateOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

// Order CRUD route'lari
router.post("/", validateOrder, orderController.create); // POST /api/orders
router.put("/:id", validateOrder, orderController.update); // PUT /api/orders/:id
router.get("/", orderController.findAll); // GET /api/orders
router.get("/:id", orderController.findOne); // GET /api/orders/:id
router.delete("/:id", orderController.delete); // DELETE /api/orders/:id

export default router;
