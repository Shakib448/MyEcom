import { IResolvers } from "@graphql-tools/utils";

const resolverMap: IResolvers = {
  Mutation: {
    printSomething(_: void, args: any): string {
      return `Printing word: ${args.word}`;
    },
  },
};
export default resolverMap;
