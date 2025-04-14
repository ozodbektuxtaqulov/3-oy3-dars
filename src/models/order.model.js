import mongoose from "mongoose";
import { collections } from "../common/constants/db.js";

const orderSchema = new mongoose.Schema(
  {
    status: {
      enum: ["processing", "shipped", "delivered"],
    },
    total: {
      type: Number,
      min: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collections.user,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collections.product,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model(collections.order, orderSchema);
