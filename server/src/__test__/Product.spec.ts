import { connectDB, stopDB } from "../config/db";
import ProductInterface from "../interface/Product.interface";
import graphQLRequest from "../Utils/graphQLRequest";

describe("Product Testing", () => {
  beforeAll(async () => {
    await connectDB();
  });
  afterAll(async () => {
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

    expect(Array.isArray(res.body.data.getAllProducts)).toBe(true);
    expect(res.statusCode).toBe(200);
  });
});
