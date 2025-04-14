import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import routes from "./routes/index.js";

const app = express();

// MongoDB bilan ulanish
mongoose
  .connect("mongodb://localhost:27017/stockmanagementdb")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(morgan("dev"));
app.use(express.json());

// Barcha route'larni ulash
app.use("/api", routes);

// Oddiy route
app.get("/", (req, res) => {
  res.json({ message: "Stock Management API is running" });
});

// Serverni ishga tushirish
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
