import { IResolvers } from "@graphql-tools/utils";

const resolverMap: IResolvers = {
  Query: {
    getAllUsers: () => {},
  },
  Mutation: {
    userCreate: (_: void, args: any, context: any): any => {
      if (context.res.statusCode === 200) {
        return { message: "Ok" };
      }
      return args;
    },
  },
};
export default resolverMap;
