import { IResolvers } from "@graphql-tools/utils";
import { UserInputError } from "apollo-server-core";

import { userValidationSchema } from "../interface/User.interface";
import User from "../models/User.model";
import generateToken from "../Utils/generateToken";

const resolverMap: IResolvers = {
  Query: {
    getAllUsers: async () => {
      return await User.find();
    },
  },
  Mutation: {
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
    updateUser: async (_: void, args: any) => {
      const { error } = userValidationSchema.validate(args, {
        abortEarly: false,
      });

      if (error) {
        throw new UserInputError(
          "Failed to create a character due to validation error",
          { validationError: error.details }
        );
      }

      const user: any = await User.findOne({ email: args.email });

      if (!user) {
        throw new UserInputError("User not found");
      }

      if (user) {
        user.email = args.email;
        user.firstName = args.firstName;
        user.lastName = args.lastName;
        user.phoneNumber = args.phoneNumber;
        user.address = args.address;
        user.city = args.city;
        user.country = args.country;
        user.state = args.state;
        user.location = args.location;
        if (args?.password) {
          user.password = args.password;
        }

        const updatedUser = await user.save();

        return {
          success: true,
          message: "User updated successfully",
          user: {
            ...args,
            id: updatedUser._id,
            token: generateToken(updatedUser._id),
          },
        };
      }
    },
    userById: async (_: any, args: any) => {
      const user = await User.findById(args.id);
      if (user) {
        return user;
      } else {
        throw new UserInputError("User not found");
      }
    },
  },
};
export default resolverMap;
