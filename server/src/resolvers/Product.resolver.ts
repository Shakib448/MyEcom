import { UserInputError, AuthenticationError } from "apollo-server-core";
import { IResolvers } from "@graphql-tools/utils";

import { productValidationSchema } from "../interface/Product.interface";
import Product from "../models/Product.model";
import User from "../models/User.model";
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

      const userProduct: any = await User.findById(user._id);

      const newProduct = await Product.create({
        ...product,
        user: user._id,
      });

      if (newProduct.user.toString() === user._id.toString()) {
        const product = {
          product_id: newProduct._id,
          user: user._id,
          name: newProduct.name,
          image: newProduct.image,
          description: newProduct.description,
          brand: newProduct.brand,
          category: newProduct.category,
          price: newProduct.price,
          countInStock: newProduct.countInStock,
          rating: newProduct.rating,
          numReviews: newProduct.numReviews,
          reviews: [...newProduct.reviews],
        };
        userProduct.products.push(product);

        await userProduct.save();
      }

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

      const pd: any = await Product.findById(id);
      const { user }: any = await getAuthorizedUser(req);

      if (!pd) {
        throw new UserInputError("No Product Found!");
      }

      if (pd?.user.toString() === user._id.toString()) {
        pd.name = input.name;
        pd.image = input.image;
        pd.description = input.description;
        pd.brand = input.brand;
        pd.category = input.category;
        pd.countInStock = input.countInStock;
        pd.price = input.price;

        const updateProduct = await pd.save();
        return {
          success: true,
          message: "Product updated successfully",
          product: updateProduct,
        };
      } else {
        throw new AuthenticationError("Not authorized, no token found");
      }
    },

    createProductReview: async (_: void, { id, input }: any, { req }: any) => {
      const { rating, comment } = input;
      const pd: any = await Product.findById(id);
      const { user }: any = await getAuthorizedUser(req);

      if (pd) {
        const alreadyReviewed = pd.reviews.find(
          (r: any) => r.user.toString() === user._id.toString()
        );

        if (alreadyReviewed) {
          throw new UserInputError("Product already reviewed");
        }

        const updateUserReview = user.products.find(
          (review: any) => review.product_id.toString() === pd._id.toString()
        );

        const review = {
          name: `${user.firstName} ${user.lastName}`,
          rating: Number(rating),
          comment,
          user: user._id,
        };

        if (updateUserReview) {
          updateUserReview.reviews.push(review);
          updateUserReview.numReviews = updateUserReview.reviews.length;

          updateUserReview.rating =
            updateUserReview.reviews.reduce(
              (acc: any, item: any) => item.rating + acc,
              0
            ) / updateUserReview.reviews.length;
          await user.save();
        }

        console.log(updateUserReview);
        // Product Review
        pd.reviews.push(review);
        pd.numReviews = pd.reviews.length;

        pd.rating =
          pd.reviews.reduce((acc: any, item: any) => item.rating + acc, 0) /
          pd.reviews.length;

        await pd.save();
        // Update User Review

        return {
          success: true,
          message: "Review added successfully",
        };
      } else {
        throw new UserInputError("Product not found!");
      }
    },

    deleteProduct: async (_: void, { id }: any, { req }: any) => {
      const pd: any = await Product.findById(id);
      const { user }: any = await getAuthorizedUser(req);

      if (!pd) {
        throw new UserInputError("No Product Found!");
      }

      if (pd?.user.toString() === user._id.toString() || user.isAdmin) {
        pd.deleteOne();
        return {
          success: true,
          message: "Product deleted successfully",
        };
      } else {
        throw new AuthenticationError("Not authorized, no token found");
      }
    },
  },
};

export default resolverMap;
