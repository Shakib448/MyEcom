import { connectDB, stopDB } from "../config/db";
import User from "../models/User.model";
import graphQLRequest from "../Utils/graphRequest";

describe("User testing", () => {
  beforeAll(async () => {
    await connectDB();
    await User.deleteOne();
  });
  afterAll(async () => {
    await stopDB();
  });
  it("User will be created with success message", async () => {
    const res = await graphQLRequest(`mutation UserCreate {
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

    expect(res.body.data.userCreate.message).toBe("User created successfully");
    expect(res.body.data.userCreate.success).toBe(true);
    expect(res.body.data.userCreate.user).toBeInstanceOf(Object);
  });
});
