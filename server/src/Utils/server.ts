import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import compression from "compression";
import schema from "../schemas/Schema";
import express from "express";

const app = express();
app.use(cors({ origin: "*" }));
app.use(compression());

(async () => {
  const server = new ApolloServer({
    schema,
  });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
})();

export default app;
