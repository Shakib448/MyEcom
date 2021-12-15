import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

import UserInterface from "../interface/User.interface";

const productSchema = new Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: false,
    ref: "Product",
  },
  user: { type: String },
  name: { type: String },
  image: { type: String },
  description: { type: String },
  cloudinary_id: { type: String },
  brand: { type: String },
  category: { type: String },
  price: { type: Number },
  countInStock: { type: Number },
  rating: { type: Number },
  numReviews: { type: Number },
  reviews: [
    {
      name: { type: String },
      comment: { type: String },
      rating: { type: Number },
      user: { type: String },
    },
  ],
});

const userSchema = new Schema<UserInterface>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    location: { type: String, required: true },
    isAdmin: { type: Boolean, require: true, default: false },
    products: [productSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
