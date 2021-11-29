import { IResolvers } from "@graphql-tools/utils";

const resolverMap: IResolvers = {
  Query: {
    getAllUsers: () => {},
  },
  Mutation: {
    userCreate: (_: void, args: any): any => {
      return {
        success: true,
        message: "User created successfully",
        user: args,
      };
    },
  },
};
export default resolverMap;
