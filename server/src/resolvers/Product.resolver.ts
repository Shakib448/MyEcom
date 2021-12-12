import { UserInputError } from "apollo-server-core";
import { IResolvers } from "@graphql-tools/utils";
import { productValidationSchema } from "../interface/Product.interface";
import Product from "../models/Product.model";
import getAuthorizedUser from "../middleware/authMiddleware";
import { AggregationCursor } from "mongoose";

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
    updateProduct: async (_: void, { id, input }: any, { req }: any) => {
      const { error } = productValidationSchema.validate(input, {
        abortEarly: false,
      });

      if (error) {
        throw new UserInputError(
          "Failed to create a character due to validation error",
          { validationError: error.details }
        );
      }

      const product = await Product.findById(id);
      const { user }: any = await getAuthorizedUser(req);

      console.log(product);

      if (product?.user.toString() === user._id.toString() || user.isAdmin) {
        // const updateProduct = await user.save();
        // return {
        //   success: true,
        //   message: "Product updated successfully",
        // };
      } else {
        // return {
        //   success: false,
        //   message: "Product Not Found!",
        // };
      }
    },
  },
};

export default resolverMap;
