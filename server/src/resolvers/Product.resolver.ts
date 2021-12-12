import { UserInputError } from "apollo-server-core";
import { IResolvers } from "@graphql-tools/utils";
import { productValidationSchema } from "../interface/Product.interface";
import Product from "../models/Product.model";
import getAuthorizedUser from "../middleware/authMiddleware";

const resolverMap: IResolvers = {
  Query: {
    getAllProducts: async () => {
      return await Product.find();
    },
  },
  Mutation: {
    createProduct: async (_: void, { product }: any, { req }: any) => {
      const { error } = productValidationSchema.validate(product, {
        abortEarly: false,
      });

      if (error) {
        throw new UserInputError(
          "Failed to create a character due to validation error",
          { validationError: error.details }
        );
      }

      const { user }: any = await getAuthorizedUser(req);

      const newProduct = await Product.create({
        ...product,
        user: user._id,
      });

      return {
        success: true,
        message: "Product created successfully",
        product: newProduct,
      };
    },
  },
};

export default resolverMap;
