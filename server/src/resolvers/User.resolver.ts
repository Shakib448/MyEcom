import { IResolvers } from "@graphql-tools/utils";
import joi from "joi";

const resolverMap: IResolvers = {
  Query: {
    getAllUsers: () => {},
  },
  Mutation: {
    userCreate: (_: void, args: void): any => {
      return {
        success: true,
        message: "User created successfully",
      };
    },
  },
};
export default resolverMap;
