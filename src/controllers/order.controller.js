import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { z } from "zod";
import { Order, User, Product } from "../models/index.js";
import { validate } from "../middleware/validate.js";
import { paginate } from "../utils/pagination.js";

// Validatsiya sxemasi
const orderSchema = z.object({
  status: z
    .enum(["processing", "shipped", "delivered"], {
      message:
        "Holati faqat 'processing', 'shipped' yoki 'delivered' bolishi kerak",
    })
    .optional(),
  total: z
    .number()
    .min(0, { message: "Umumiy narx 0 dan kichik bolmasligi kerak" })
    .optional(),
  user: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Foydalanuvchi IDsi notogri",
  }),
  product: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Mahsulot IDsi notogri",
  }),
});
export const orderController = {
  // Yangi buyurtma qo'shish
  create: async (req, res, next) => {
    try {
      const { status, total, user, product } = req.body;

      // Foydalanuvchi mavjudligini tekshirish
      const userExists = await User.findById(user);
      if (!userExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "User not found",
        });
      }

      // Mahsulot mavjudligini tekshirish
      const productExists = await Product.findById(product);
      if (!productExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product not found",
        });
      }

      // Agar mahsulot omborda mavjud bo'lmasa
      if (productExists.stock <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Product is out of stock",
        });
      }

      // Total narxni mahsulot narxi asosida hisoblash (agar total kiritilmagan bo'lsa)
      const calculatedTotal = total || productExists.price;

      // Yangi buyurtma yaratish
      const newOrder = new Order({
        status: status || "processing", // Agar status kiritilmagan bo'lsa, default "processing"
        total: calculatedTotal,
        user,
        product,
      });

      // Mahsulot stokini kamaytirish
      productExists.stock -= 1;
      await productExists.save();

      // Buyurtmani saqlash
      await newOrder.save();

      res.status(StatusCodes.CREATED).json({
        message: "Order created successfully",
        order: newOrder,
      });
    } catch (err) {
      next(err);
    }
  },

  // Buyurtmani yangilash
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, total, user, product } = req.body;

      // Buyurtmani ID bo'yicha topish
      const order = await Order.findById(id);
      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Order not found",
        });
      }

      // Foydalanuvchi mavjudligini tekshirish (agar yangilansa)
      if (user) {
        const userExists = await User.findById(user);
        if (!userExists) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "User not found",
          });
        }
      }

      // Mahsulot mavjudligini tekshirish (agar yangilansa)
      if (product) {
        const productExists = await Product.findById(product);
        if (!productExists) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "Product not found",
          });
        }
      }

      // Buyurtmani yangilash
      order.status = status || order.status;
      order.total = total !== undefined ? total : order.total;
      order.user = user || order.user;
      order.product = product || order.product;
      await order.save();

      res.status(StatusCodes.OK).json({
        message: "Order updated successfully",
        order,
      });
    } catch (err) {
      next(err);
    }
  },

  // Barcha buyurtmalarni olish
  findAll: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const {
        results: orders,
        total,
        totalPages,
        currentPage,
        pageSize,
      } = await paginate(Order, page, limit, [
        { path: "user", select: "email" },
        { path: "product", select: "name price" },
      ]);

      res.status(StatusCodes.OK).json({
        message: "Buyurtmalar muvaffaqiyatli olingan",
        orders,
        total,
        totalPages,
        currentPage,
        pageSize,
      });
    } catch (err) {
      next(err);
    }
  },

  // Bitta buyurtmani ID bo'yicha olish
  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id)
        .populate("user", "email")
        .populate("product", "name price");

      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Order not found",
        });
      }

      res.status(StatusCodes.OK).json({
        message: "Order retrieved successfully",
        order,
      });
    } catch (err) {
      next(err);
    }
  },

  // Buyurtmani o'chirish
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await Order.findByIdAndDelete(id);

      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Order not found",
        });
      }

      // Mahsulot stokini qayta tiklash (buyurtma o'chirilganda)
      const product = await Product.findById(order.product);
      if (product) {
        product.stock += 1;
        await product.save();
      }

      res.status(StatusCodes.OK).json({
        message: "Order deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};

export const validateOrder = validate(orderSchema);