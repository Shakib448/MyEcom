import { IResolvers } from "@graphql-tools/utils";
import { UserInputError } from "apollo-server-core";
import { userValidationSchema } from "../interface/User.interface";
import generateToken from "../Utils/generateToken";

const resolverMap: IResolvers = {
  Query: {
    getAllUsers: () => {},
  },
  Mutation: {
    userCreate: (_: void, args: any): any => {
      const { error } = userValidationSchema.validate(args, {
        abortEarly: false,
      });

      if (error) {
        throw new UserInputError(
          "Failed to create a character due to validation error",
          { validationError: error.details }
        );
      }
      generateToken(args.password);
      return {
        success: true,
        message: "User created successfully",
      };
    },
  },
};
export default resolverMap;
