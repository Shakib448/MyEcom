import { IResolvers } from "@graphql-tools/utils";

const resolverMap: IResolvers = {
  Query: {
    getAllUsers: () => {},
  },
  Mutation: {
    userCreate: (_: void): any => {
      return {
        success: true,
        message: "User created successfully",
      };
    },
  },
};
export default resolverMap;
