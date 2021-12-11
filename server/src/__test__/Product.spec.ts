import { connectDB, stopDB } from "../config/db";
import products from "../data/products.data";
import users from "../data/users.data";
import ProductInterface from "../interface/Product.interface";
import Product from "../models/Product.model";
import User from "../models/User.model";
import graphQLRequest from "../Utils/graphQLRequest";

describe("Product Testing", () => {
  beforeAll(async () => {
    await connectDB();
    await Product.deleteMany();
    await User.deleteMany();
  });
  afterAll(async () => {
    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return {
        ...product,
        user: adminUser,
      };
    });

    await Product.insertMany(sampleProducts);
    await stopDB();
  });

  it("fetch all products with success", async () => {
    const res = await graphQLRequest(`query {
        getAllProducts {
          id
          name
          image
          description
          brand
          category
          price
          countInStock
          rating
          numReviews
        }
      }`);

    res.body.data.getAllProducts.map((item: ProductInterface) => {
      expect(typeof item.id).toBe("string");
      expect(typeof item.name).toBe("string");
      expect(typeof item.image).toBe("string");
      expect(typeof item.description).toBe("string");
      expect(typeof item.brand).toBe("string");
      expect(typeof item.category).toBe("string");
      expect(typeof item.price).toBe("number");
      expect(typeof item.countInStock).toBe("number");
      expect(typeof item.rating).toBe("number");
      expect(typeof item.numReviews).toBe("number");
    });
    expect(Array.isArray(res.body.data.getAllProducts)).toBe(true);
    expect(res.statusCode).toBe(200);
  });
});
