import { IResolvers } from "@graphql-tools/utils";
import { UserInputError } from "apollo-server-core";

import {
  authUserValidation,
  userValidationSchema,
} from "../interface/User.interface";
import getAuthorizedUser from "../middleware/authMiddleware";
import User from "../models/User.model";
import generateToken from "../Utils/generateToken";

const resolverMap: IResolvers = {
  Query: {
    getAllUsers: async () => {
      return await User.find();
    },
  },
  Mutation: {
    authUser: async (_: void, args: any) => {
      const { error } = authUserValidation.validate(args, {
        abortEarly: false,
      });

      if (error) {
        throw new UserInputError(
          "Failed to create a character due to validation error",
          { validationError: error.details }
        );
      }
      const user: any = await User.findOne({ email: args.email });

      if (user && (await user.matchPassword(args.password))) {
        return {
          success: true,
          message: "User logged in successfully",
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            city: user.city,
            zip: user.zip,
            location: user.location,
            state: user.state,
            country: user.country,
            token: generateToken(user._id),
          },
        };
      } else {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }
    },
    userCreate: async (_: void, args: any) => {
      const { error } = userValidationSchema.validate(args, {
        abortEarly: false,
      });

      if (error) {
        throw new UserInputError(
          "Failed to create a character due to validation error",
          { validationError: error.details }
        );
      }

      const userExists: any = await User.findOne({ email: args.email });

      if (userExists) {
        throw new UserInputError("User already exists");
      }

      const user = await User.create({
        ...args,
        token: generateToken(args.id),
      });

      if (user) {
        return {
          success: true,
          message: "User created successfully",
          user: { ...args, id: user._id, token: generateToken(user._id) },
        };
      }
    },
    updateUser: async (_: void, args: any, { req }: any) => {
      const { error } = userValidationSchema.validate(args, {
        abortEarly: false,
      });

      if (error) {
        throw new UserInputError(
          "Failed to create a character due to validation error",
          { validationError: error.details }
        );
      }

      const { user }: any = await getAuthorizedUser(req);

      if (!user) {
        throw new UserInputError("User not found");
      }

      if (user) {
        user.email = args.email || user.email;
        user.firstName = args.firstName || user.firstName;
        user.lastName = args.lastName || user.lastName;
        user.phoneNumber = args.phoneNumber || user.phoneNumber;
        user.address = args.address || user.address;
        user.city = args.city || user.city;
        user.country = args.country || user.country;
        user.state = args.state || user.state;
        user.location = args.location || user.location;
        if (args?.password) {
          user.password = args.password;
        }

        const updatedUser = await user.save();

        return {
          success: true,
          message: "User updated successfully",
          user: {
            id: updatedUser._id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phoneNumber: updatedUser.phoneNumber,
            address: updatedUser.address,
            city: updatedUser.city,
            zip: updatedUser.zip,
            location: updatedUser.location,
            state: updatedUser.state,
            country: updatedUser.country,
            token: generateToken(updatedUser._id),
          },
        };
      }
    },
    userById: async (_: void, args: any) => {
      const user = await User.findById(args.id);
      if (user) {
        return user;
      } else {
        throw new UserInputError("User not found");
      }
    },
    userDeleteById: async (_: void, args: any) => {
      const user = await User.findById(args.id);
      if (user) {
        user.deleteOne();
        return {
          success: true,
          message: "User deleted successfully",
        };
      } else {
        throw new UserInputError("User not found");
      }
    },
  },
};
export default resolverMap;
