import { connectDB, stopDB } from "../config/db";
import User from "../models/User.model";
import graphQLRequest from "../Utils/graphRequest";

describe("User testing", () => {
  let token: string | undefined;
  console.log("TOken", token);
  beforeAll(async () => {
    await connectDB();
    await User.deleteOne();
  });
  afterAll(async () => {
    await stopDB();
  });

  it("Module should be define", () => {
    expect(User).toBeDefined();
  });

  it("User will be created with success message", async () => {
    const req = await graphQLRequest(
      `mutation UserCreate {
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
    }`
    );
    expect(req.body.data.userCreate.message).toBe("User created successfully");
    expect(req.body.data.userCreate.success).toBe(true);
    expect(req.body.data.userCreate.user).toBeInstanceOf(Object);
    expect(req.body.data.userCreate).toMatchSnapshot();
  });

  it("User will be logged in successfully with success message", async () => {
    const req = await graphQLRequest(
      `mutation AuthUser {
      authUser(email : "test@test.com" password : "12345678"){
        message
        success
        user {
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
          token
        }
      }
    }`
    );

    expect(req.body.data.authUser.message).toBe("User logged in successfully");
    expect(req.body.data.authUser.success).toBe(true);
    expect(req.body.data.authUser.user.token).toBeDefined();
    expect(req.body.data.authUser.user).toBeInstanceOf(Object);
  });

  it("User will be created with success message", async () => {
    const resToken = await graphQLRequest(
      `mutation AuthUser {
      authUser(email : "test@test.com" password : "12345678"){
        message
        success
        user {
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
          token
        }
      }
    }`
    );
    const req = await graphQLRequest(
      `mutation UpdateUser {
      updateUser(
        email: "test@test.com"
        password: "update123456"
        confirmPassword: "update123456"
        firstName: "update name"
        lastName: "update"
        phoneNumber: "1234567"
        address: "update address"
        city: "update city"
        country: "update country"
        state: "update state"
        location: "update location"
        zip: "12345"
      ) {
        message
        success
        user {
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
    }`,
      resToken.body.data.authUser.user.token
    );

    expect(req.body.data.updateUser.message).toBe("User updated successfully");
    expect(req.body.data.updateUser.success).toBe(true);
    expect(req.body.data.updateUser.user).toBeInstanceOf(Object);
    expect(req.body.data.updateUser).toMatchSnapshot();
  });

  it("User array also findById user should be define", async () => {
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

  it("User should be delete with success message", async () => {
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

    const userId = req.body.data.getAllUsers.map((item: any) => item.id);

    const deleteUser = await graphQLRequest(`mutation UserDeleteById{
      userDeleteById(id: "${userId[0]}") {
        success
        message
      }
    }`);
    expect(deleteUser.body.data.userDeleteById).toBeInstanceOf(Object);
    expect(deleteUser.body.data.userDeleteById.success).toBe(true);
    expect(deleteUser.body.data.userDeleteById.message).toBe(
      "User deleted successfully"
    );
    expect(deleteUser.body.data.userDeleteById).toMatchSnapshot();
  });
});
