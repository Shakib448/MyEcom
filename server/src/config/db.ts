import mongoose from "mongoose";

const dbURL = "mongodb://localhost:27017/myEcom";

export async function connectDB(): Promise<void> {
  await mongoose.connect(dbURL);
  console.log("Database connected successfully");
}

export async function stopDB(): Promise<void> {
  await mongoose.connection.close();
}
