import { IResolvers } from "@graphql-tools/utils";
import Product from "../models/Product.model";

const resolverMap: IResolvers = {
  Query: {
    getAllProducts: async () => {
      return await Product.find();
    },
  },
  Mutation: {
    createProduct: async (_: void, { product }: any) => {
      return {
        success: true,
        message: "Product created successfully",
        product,
      };
    },
  },
};

export default resolverMap;
