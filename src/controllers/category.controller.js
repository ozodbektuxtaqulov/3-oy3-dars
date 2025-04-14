import { StatusCodes } from "http-status-codes";
import { Category } from "../models/index.js";

export const categoryController = {
  // Yangi kategoriya qo'shish
  create: async (req, res, next) => {
    try {
      const { name } = req.body;

      // Kategoriya nomi allaqachon mavjudligini tekshirish
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Category with this name already exists",
        });
      }

      // Yangi kategoriya yaratish
      const newCategory = new Category({ name });
      await newCategory.save();

      res.status(StatusCodes.CREATED).json({
        message: "Category created successfully",
        category: newCategory,
      });
    } catch (err) {
      next(err);
    }
  },

  // Kategoriyani yangilash
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Kategoriyani ID bo'yicha topish
      const category = await Category.findById(id);
      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Category not found",
        });
      }

      // Yangi nom boshqa kategoriya bilan to'qnashmasligini tekshirish
      if (name && name !== category.name) {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
          return res.status(StatusCodes.CONFLICT).json({
            message: "Category with this name already exists",
          });
        }
      }

      // Kategoriyani yangilash
      category.name = name || category.name;
      await category.save();

      res.status(StatusCodes.OK).json({
        message: "Category updated successfully",
        category,
      });
    } catch (err) {
      next(err);
    }
  },

  // Barcha kategoriyalarni olish
  findAll: async (req, res, next) => {
    try {
      const categories = await Category.find();
      res.status(StatusCodes.OK).json({
        message: "Categories retrieved successfully",
        categories,
      });
    } catch (err) {
      next(err);
    }
  },

  // Bitta kategoriyani ID bo'yicha olish
  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);

      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Category not found",
        });
      }

      res.status(StatusCodes.OK).json({
        message: "Category retrieved successfully",
        category,
      });
    } catch (err) {
      next(err);
    }
  },

  // Kategoriyani o'chirish
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await Category.findByIdAndDelete(id);

      if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Category not found",
        });
      }

      res.status(StatusCodes.OK).json({
        message: "Category deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};
