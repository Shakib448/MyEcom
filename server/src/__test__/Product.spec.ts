import { connectDB, stopDB } from "../config/db";
import products from "../data/products.data";
import users from "../data/users.data";
import ProductInterface from "../interface/Product.interface";
import Product from "../models/Product.model";
import User from "../models/User.model";
import graphQLRequest from "../Utils/graphQLRequest";

describe("(Product Resolvers)", () => {
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
      expect(typeof item.reviews).toBe("array");
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

  it("Product Review will be created with success message", async () => {
    const resToken = await graphQLRequest(`mutation AuthUser{
      authUser(email : "muktadir@example.com", password : "123456789"){
        message
        success
        user{
          token
        }
      }
    }`);

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
    const pdId = res.body.data.getAllProducts.map((item: any) => item.id);

    const req = await graphQLRequest(
      `mutation CreateReview{
        createProductReview(id : "${pdId[0]}", input : {
          rating : 3,
          comment : "Not Bad"
        }){
          message
          success
        }
      }`,
      resToken.body.data.authUser.user.token
    );

    expect(req.body.data.createProductReview.success).toBe(true);
    expect(req.body.data.createProductReview.message).toBe(
      "Review added successfully"
    );
    expect(req.body.data.createProductReview).toMatchSnapshot();

    expect(req.statusCode).toBe(200);
  });

  it("Product will be updated with success message", async () => {
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
    const pdId = res.body.data.getAllProducts.map((item: any) => item.id);

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
      `mutation UpdateProduct {
        updateProduct(
          id: "${pdId[0]}"
          input: {
            name: "Update name"
            brand: "Update Brand"
            category: "Update Category"
            image : "https://i.ibb.co/q9QZnkL/airpods.jpg"
            countInStock: 2
            price: 99.9
            description: "Update Description"
          }
        ) {
          message
          success
          product {
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

    expect(req.body.data.updateProduct.message).toBe(
      "Product updated successfully"
    );
    expect(req.body.data.updateProduct.success).toBe(true);
    expect(req.body.data.updateProduct.product).toBeInstanceOf(Object);

    expect(req.statusCode).toBe(200);
  });

  it("Product will be deleted by the user with success message", async () => {
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
    const pdId = res.body.data.getAllProducts.map((item: any) => item.id);
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
      `mutation DeleteProduct{
        deleteProduct(id : "${pdId[0]}"){
          message
          success
        }
      }`,
      resToken.body.data.authUser.user.token
    );

    expect(req.body.data.deleteProduct.success).toBe(true);
    expect(req.body.data.deleteProduct.message).toBe(
      "Product deleted successfully"
    );
    expect(req.body.data.deleteProduct).toMatchSnapshot();

    expect(req.statusCode).toBe(200);
  });

  it("Product will be deleted by the admin user with success message", async () => {
    const resUserToken = await graphQLRequest(`mutation AuthUser{
      authUser(email : "muktadir@example.com", password : "123456789"){
        message
        success
        user{
          token
        }
      }
    }`);

    await graphQLRequest(
      `mutation CreateProduct {
        createProduct(
          product: {
            name: "simple"
            image: "https://i.ibb.co/q9QZnkL/airpods.jpg"
            category: "sample category"
            price: 89.99
            countInStock: 10
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
      resUserToken.body.data.authUser.user.token
    );
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
    const pdId = res.body.data.getAllProducts.map((item: any) => item.id);

    const resAdminToken = await graphQLRequest(`mutation AuthUser{
      authUser(email : "admin@example.com", password : "123456789"){
        message
        success
        user{
          token
        }
      }
    }`);

    const req = await graphQLRequest(
      `mutation DeleteProduct{
        deleteProduct(id : "${pdId[0]}"){
          message
          success
        }
      }`,
      resAdminToken.body.data.authUser.user.token
    );

    expect(req.body.data.deleteProduct.success).toBe(true);
    expect(req.body.data.deleteProduct.message).toBe(
      "Product deleted successfully"
    );
    expect(req.body.data.deleteProduct).toMatchSnapshot();

    expect(req.statusCode).toBe(200);
  });
});
