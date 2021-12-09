import mongoose from "mongoose";
import "colors";
import users from "../data/users";
import User from "../models/User.model";
import { connectDB } from "../config/db";

connectDB();

const importData = async () => {
  await User.deleteMany();

  await User.insertMany(users);

  console.log("Data imported".green.inverse);
  process.exit();
  try {
  } catch (error) {
    console.log(`${error}`.red.inverse);
  }
};

const destroyedData = async () => {
  try {
    await User.deleteMany();

    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
  }
};

if (process.argv[2] === "-d") {
  destroyedData();
} else {
  importData();
}
