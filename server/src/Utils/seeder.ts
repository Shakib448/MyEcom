import "colors";

import users from "../data/users.data";
import products from "../data/products.data";
import User from "../models/User.model";
import Product from "../models/Product.model";
import { connectDB } from "../config/db";

connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return {
        ...product,
        user: adminUser,
      };
    });

    await Product.insertMany(sampleProducts);
    console.log("Data imported".green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
  }
};

const destroyedData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

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
