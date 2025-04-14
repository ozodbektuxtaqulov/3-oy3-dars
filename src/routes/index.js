import express from "express";
import authRoutes from "./auth.js";
import userRoutes from "./user.js";
import productRoutes from "./product.js";
import categoryRoutes from "./category.js";
import orderRoutes from "./order.js";

const router = express.Router();

// Barcha route'larni birlashtirish
router.use("/auth", authRoutes); // /api/auth/...
router.use("/users", userRoutes); // /api/users/...
router.use("/products", productRoutes); // /api/products/...
router.use("/categories", categoryRoutes); // /api/categories/...
router.use("/orders", orderRoutes); // /api/orders/...

export default router;
