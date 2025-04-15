import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { z } from "zod";
import { Product, Category } from "../models/index.js";
import { validate } from "../middleware/validate.js";
import { paginate } from "../utils/pagination.js";


const productSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Mahsulot nomi kamida 3 belgidan iborat bolishi kerak",
    })
    .max(100, { message: "Mahsulot nomi 100 belgi dan oshmasligi kerak" }),
  price: z.number().min(0, { message: "Narx 0 dan kichik bolmasligi kerak" }),
  description: z.string().min(1, { message: "Tavsif bosh bolmasligi kerak" }),
  stock: z
    .number()
    .min(0, { message: "Stok 0 dan kichik bolmasligi kerak" })
    .int({ message: "Stok butun son bolishi kerak" }),
  category: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Kategoriya IDsi notogri",
  }),
});
export const productController = {
  // Yangi mahsulot qo'shish
  create: async (req, res, next) => {
    try {
      const { name, price, description, stock, category } = req.body;

      // Kategoriya mavjudligini tekshirish
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Category not found",
        });
      }

      // Mahsulot nomi allaqachon mavjudligini tekshirish
      const existingProduct = await Product.findOne({ name });
      if (existingProduct) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Product with this name already exists",
        });
      }

      // Yangi mahsulot yaratish
      const newProduct = new Product({
        name,
        price,
        description,
        stock,
        category,
      });
      await newProduct.save();

      res.status(StatusCodes.CREATED).json({
        message: "Product created successfully",
        product: newProduct,
      });
    } catch (err) {
      next(err);
    }
  },

  // Mahsulotni yangilash
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, price, description, stock, category } = req.body;

      // Mahsulotni ID bo'yicha topish
      const product = await Product.findById(id);
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product not found",
        });
      }

      // Kategoriya mavjudligini tekshirish (agar yangilansa)
      if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "Category not found",
          });
        }
      }

      // Yangi nom boshqa mahsulot bilan to'qnashmasligini tekshirish
      if (name && name !== product.name) {
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
          return res.status(StatusCodes.CONFLICT).json({
            message: "Product with this name already exists",
          });
        }
      }

      // Mahsulotni yangilash
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.stock = stock !== undefined ? stock : product.stock;
      product.category = category || product.category;
      await product.save();

      res.status(StatusCodes.OK).json({
        message: "Product updated successfully",
        product,
      });
    } catch (err) {
      next(err);
    }
  },

  // Barcha mahsulotlarni olish
  findAll: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const {
        results: products,
        total,
        totalPages,
        currentPage,
        pageSize,
      } = await paginate(Product, page, limit, {
        path: "category",
        select: "name",
      });

      res.status(StatusCodes.OK).json({
        message: "Mahsulotlar muvaffaqiyatli olingan",
        products,
        total,
        totalPages,
        currentPage,
        pageSize,
      });
    } catch (err) {
      next(err);
    }
  },

  // Bitta mahsulotni ID bo'yicha olish
  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id).populate("category", "name");

      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product not found",
        });
      }

      res.status(StatusCodes.OK).json({
        message: "Product retrieved successfully",
        product,
      });
    } catch (err) {
      next(err);
    }
  },

  // Mahsulotni o'chirish
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Product not found",
        });
      }

      res.status(StatusCodes.OK).json({
        message: "Product deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};

export const validateProduct = validate(productSchema);
