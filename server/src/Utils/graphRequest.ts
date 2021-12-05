import app from "./server";
import supertest from "supertest";

const graphQLRequest = (query: string, token?: string) => {
  console.log("token", token);
  return supertest(app)
    .post("/graphql")
    .send({
      query,
    })
    .set("Authorization", `Bearer ${token}`);
};

export default graphQLRequest;
