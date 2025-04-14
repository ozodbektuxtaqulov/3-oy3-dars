import { connect } from "mongoose";
import { config } from "../config/index.js";

export async function connectionDB() {
  try {
    await connect(config.db.url);
    console.log("Mognodb connected");
  } catch (error) {
    console.log("DB connection fail");
    process.exit(1);
  }
}
