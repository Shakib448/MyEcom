import { connectDB, stopDB } from "../config/db";
import User from "../models/User.model";
import graphQLRequest from "../Utils/graphRequest";

describe("User testing", () => {
  beforeAll(async () => {
    await connectDB();
    await User.deleteMany();
  });
  afterAll(async () => {
    await stopDB();
  });

  it("Module should be define", () => {
    expect(User).toBeDefined();
  });

  it("User will be created with success message", async () => {
    const req = await graphQLRequest(`mutation UserCreate {
      userCreate(
        email: "test@test.com"
        password: "12345678"
        confirmPassword: "12345678"
        firstName: "testFirst name"
        lastName: "Test"
        phoneNumber: "1234567"
        address: "test"
        city: "test"
        country: "test"
        state: "test"
        location: "test"
        zip: "12345"
      ) {
        message
        success
        user {
          id
          email
          firstName
          lastName
          phoneNumber
          address
          city
          zip
          location
          state
          country
        }
      }
    }`);

    expect(req.body.data.userCreate.message).toBe("User created successfully");
    expect(req.body.data.userCreate.success).toBe(true);
    expect(req.body.data.userCreate.user).toBeInstanceOf(Object);
  });

  it("User will be created with success message", async () => {
    const req = await graphQLRequest(`mutation UpdateUser {
      updateUser(
        email: "test@test.com"
        password: "test12345678"
        confirmPassword: "test12345678"
        firstName: "testFirst name"
        lastName: "Test"
        phoneNumber: "1234567"
        address: "test"
        city: "test"
        country: "test"
        state: "test"
        location: "test"
        zip: "12345"
      ) {
        message
        success
        user {
          id
          email
          firstName
          lastName
          phoneNumber
          address
          city
          zip
          location
          state
          country
        }
      }
    }`);

    expect(req.body.data.updateUser.message).toBe("User updated successfully");
    expect(req.body.data.updateUser.success).toBe(true);
    expect(req.body.data.updateUser.user).toBeInstanceOf(Object);
  });

  it("User array also findById object should be define", async () => {
    const req = await graphQLRequest(`query GetAllUser {
      getAllUsers {
        id
        email
        firstName
        lastName
        phoneNumber
        address
        city
        country
        state
        zip
        location
      }
    }`);
    expect(Array.isArray(req.body.data.getAllUsers)).toBe(true);

    const userId = req.body.data.getAllUsers.map((item: any) => item.id);

    const findById = await graphQLRequest(`mutation UserById {
      userById(id: "${userId[0]}") {
        id
        email
        firstName
        lastName
        phoneNumber
        address
        city
        country
        state
        zip
        location
      }
    }`);
    expect(findById.body.data.userById).toBeInstanceOf(Object);
  });
});
