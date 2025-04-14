import { StatusCodes } from "http-status-codes"; 
import { User } from "../models/index.js";
import bcrypt from "bcrypt";

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
