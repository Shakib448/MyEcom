import { IResolvers } from "@graphql-tools/utils";
import { UserInputError } from "apollo-server-core";
import { userValidationSchema } from "../interface/User.interface";

const resolverMap: IResolvers = {
  Query: {
    getAllUsers: () => {},
  },
  Mutation: {
    userCreate: (_: void, args: void): any => {
      const { error } = userValidationSchema.validate(args, {
        abortEarly: false,
      });

      if (error) {
        throw new UserInputError(
          "Failed to create a character due to validation error",
          { validationError: error.details }
        );
      }
      console.log("args", args);
      return {
        success: true,
        message: "User created successfully",
      };
    },
  },
};
export default resolverMap;
