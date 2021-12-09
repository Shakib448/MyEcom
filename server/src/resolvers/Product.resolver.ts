import { IResolvers } from "@graphql-tools/utils";
import Product from "../models/Product.model";

const resolverMap: IResolvers = {
  Query: {
    getAllProducts: async () => {
      return await Product.find();
    },
  },
};

export default resolverMap;
