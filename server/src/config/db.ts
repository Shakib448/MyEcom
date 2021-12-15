import mongoose from "mongoose";
import "colors";

const dbURL = "mongodb://localhost:27017/myEcom";

export async function connectDB(): Promise<any> {
  await mongoose.connect(dbURL);
  console.log("Database connected successfully".cyan.italic);
}

export async function stopDB(): Promise<void> {
  await mongoose.connection.close();
}
