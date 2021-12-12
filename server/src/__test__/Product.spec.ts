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
  });
  afterAll(async () => {
    await Product.deleteMany();
    await User.deleteMany();

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
    const req = await graphQLRequest(`query {
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

    req.body.data.getAllProducts.map((item: ProductInterface) => {
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
    expect(Array.isArray(req.body.data.getAllProducts)).toBe(true);
    expect(req.statusCode).toBe(200);
  });

  it("Product will be created with success message", async () => {
    const resToken = await graphQLRequest(`mutation AuthUser{
      authUser(email : "muktadir@example.com", password : "123456789"){
        message
        success
        user{
          token
        }
      }
    }`);

    const req = await graphQLRequest(
      `mutation CreateProduct {
        createProduct(
          product: {
            name: "simple"
            image: "https://i.ibb.co/q9QZnkL/airpods.jpg"
            category: "sample category"
            price: 89.99
            countInStock: 10
            numReviews: 5
            description: "sample description"
            brand: "sample brand"
          }
        ) {
          success
          message
          product{
            brand
            category
            countInStock
            description
            image
            name
            numReviews
            price
            rating
            reviews {
              comment
              name
              rating
              user
            }
          }
        }
      }`,
      resToken.body.data.authUser.user.token
    );

    expect(req.body.data.createProduct.message).toBe(
      "Product created successfully"
    );
    expect(req.body.data.createProduct.success).toBe(true);
    expect(req.body.data.createProduct.product).toBeInstanceOf(Object);
    expect(req.body.data.createProduct.product).toMatchSnapshot();

    expect(req.statusCode).toBe(200);
  });
});
