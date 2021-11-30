import { IResolvers } from "@graphql-tools/utils";
import { UserInputError } from "apollo-server-core";
import { userValidationSchema } from "../interface/User.interface";
import User from "../models/User.model";
import generateToken from "../Utils/generateToken";

const resolverMap: IResolvers = {
  Query: {
    getAllUsers: () => {
      return User.find();
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
  },
};
export default resolverMap;
