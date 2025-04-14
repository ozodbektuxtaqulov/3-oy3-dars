import mongoose from "mongoose";
import { collections } from "../common/constants/db.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collections.category,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model(collections.product, productSchema);
