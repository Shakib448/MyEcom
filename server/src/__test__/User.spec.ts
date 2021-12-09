import { connectDB, stopDB } from "../config/db";
import User from "../models/User.model";
import graphQLRequest from "../Utils/graphQLRequest";
import users from "../data/users.data";

describe("User testing", () => {
  beforeAll(async () => {
    await connectDB();
    await User.deleteMany();
  });
  afterAll(async () => {
    await User.insertMany(users);
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

  it("User will be updated with Bearer token also find by id with success message", async () => {
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

    const findById = await graphQLRequest(
      `mutation GetUserProfile {
        getUserProfile(id: "${resToken.body.data.authUser.user.id}") {
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
    }`,
      resToken.body.data.authUser.user.token
    );
    expect(findById.body.data.getUserProfile).toBeInstanceOf(Object);
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
