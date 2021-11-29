import mongoose, { Schema } from "mongoose";
import UserInterface from "../interface/User.interface";

const userSchema = new Schema<UserInterface>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    location: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
