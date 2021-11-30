import { stopDB } from "../config/db";
import graphQLRequest from "../Utils/graphRequest";

describe("User testing", () => {
  afterAll(async () => {
    await stopDB();
  });
  it("User will be created with success message", async () => {
    const res = await graphQLRequest(`mutation UserCreate {
      userCreate(
        id: "1"
        email: "shakib@test.com"
        password: "12345678"
        confirmPassword: "12345678"
        firstName: "muktadir"
        lastName: "ahamed"
        phoneNumber: "1234567"
        address: "mirpur"
        city: "Dhaka"
        country: "Bangladesh"
        state: "mirpur"
        location: "BD"
        zip: "12345"
      ) {
        message
        success
      }
    }`);

    expect(res.body.data.userCreate.message).toBe("User created successfully");
    expect(res.body.data.userCreate.success).toBe(true);
    expect(res.body.data.userCreate).toMatchSnapshot();
  });
});
