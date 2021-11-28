import { IResolvers } from "@graphql-tools/utils";

const resolverMap: IResolvers = {
  Query: {
    getAllUsers: () => {},
  },
  Mutation: {
    userCreate: (_: void, args: any): any => {
      return args;
    },
  },
};
export default resolverMap;
