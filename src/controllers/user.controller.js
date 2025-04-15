import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { User } from "../models/index.js";
import { validate } from "../middleware/validate.js";
import { paginate } from "../utils/pagination.js";

// Validatsiya sxemasi
const userSchema = z.object({
  full_name: z
    .string()
    .min(3, { message: "Ism kamida 3 belgidan iborat bolishi kerak" })
    .max(100, { message: "Ism 100 belgi dan oshmasligi kerak" })
    .optional(),
  email: z.string().email({ message: "Email formati notogri" }),
  password: z
    .string()
    .min(5, { message: "Parol kamida 5 belgidan iborat bolishi kerak" })
    .max(50, { message: "Parol 50 belgi dan oshmasligi kerak" }),
});

export const userController = {
  // Yangi foydalanuvchi qo'shish
  create: async (req, res, next) => {
    try {
      const { full_name, email, password } = req.body;

      // Email allaqachon mavjudligini tekshirish
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "User with this email already exists",
        });
      }

      // Yangi foydalanuvchi yaratish
      const newUser = new User({
        full_name,
        email,
        password, // Parol avtomatik hashlangan holda saqlanadi (pre("save"))
      });
      await newUser.save();

      // Parolni javobda yubormaslik uchun olib tashlash
      const userResponse = newUser.toObject();
      delete userResponse.password;

      res.status(StatusCodes.CREATED).json({
        message: "User created successfully",
        user: userResponse,
      });
    } catch (err) {
      next(err);
    }
  },

  // Foydalanuvchini yangilash
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { full_name, email, password } = req.body;

      // Foydalanuvchini ID bo'yicha topish
      const user = await User.findById(id);
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "User not found",
        });
      }

      // Yangi email boshqa foydalanuvchi bilan to'qnashmasligini tekshirish
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(StatusCodes.CONFLICT).json({
            message: "User with this email already exists",
          });
        }
      }

      // Foydalanuvchini yangilash
      user.full_name = full_name || user.full_name;
      user.email = email || user.email;
      if (password) {
        user.password = password; // Parol yangilansa, pre("save") middleware hashlashni amalga oshiradi
      }
      await user.save();

      // Parolni javobda yubormaslik uchun olib tashlash
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(StatusCodes.OK).json({
        message: "User updated successfully",
        user: userResponse,
      });
    } catch (err) {
      next(err);
    }
  },

  // Barcha foydalanuvchilarni olish
  findAll: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const {
        results: users,
        total,
        totalPages,
        currentPage,
        pageSize,
      } = await paginate(User, page, limit);

      res.status(StatusCodes.OK).json({
        message: "Foydalanuvchilar muvaffaqiyatli olingan",
        users,
        total,
        totalPages,
        currentPage,
        pageSize,
      });
    } catch (err) {
      next(err);
    }
  },

  // Bitta foydalanuvchini ID bo'yicha olish
  findOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select("-password"); // Parolni javobdan olib tashlash

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "User not found",
        });
      }

      res.status(StatusCodes.OK).json({
        message: "User retrieved successfully",
        user,
      });
    } catch (err) {
      next(err);
    }
  },

  // Foydalanuvchini o'chirish
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "User not found",
        });
      }

      res.status(StatusCodes.OK).json({
        message: "User deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};

export const validateUser = validate(userSchema);
