import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import { validate } from "../middleware/validate.js";


// Validatsiya sxemalari
const signUpSchema = z.object({
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

const signInSchema = z.object({
  email: z.string().email({ message: "Email formati notogri" }),
  password: z.string()
    .min(5, { message: "Parol kamida 5 belgidan iborat bolishi kerak" })
    .max(50, { message: "Parol 50 belgi dan oshmasligi kerak" }),
});

export const authController = {
  signUp: async (req, res, next) => {
    try {
      const body = req.body;
      const user = await User.findOne(
        { email: body.email },
        "email _id"
      ).exec();

      console.log(user);
      if (!user) {
        const newUser = new User(body);

        await newUser.save();
        res.send(newUser);
      }

      res.send("User already exists!");
      return;
    } catch (err) {
      next(err);
    }
  },

  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Email bo'yicha foydalanuvchini topish
      const user = await User.findOne({ email }).exec();
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "User not found",
        });
      }

      // Parolni solishtirish
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Invalid password",
        });
      }

      // Muvaffaqiyatli javob qaytarish
      res.status(StatusCodes.OK).json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

export const validateSignUp = validate(signUpSchema);
export const validateSignIn = validate(signInSchema);