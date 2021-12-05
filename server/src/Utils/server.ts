import jwt, { JwtPayload } from "jsonwebtoken";
import { ApolloServer } from "apollo-server-express";
import { AuthenticationError } from "apollo-server-core";
import dotenv from "dotenv";
import compression from "compression";
import express from "express";

import schema from "../schemas/Schema";
import { connectDB } from "../config/db";
import User from "../models/User.model";

dotenv.config();

const app = express();
app.use(compression());
connectDB().catch((err) => console.log(err));

(async () => {
  const server = new ApolloServer({
    schema,
    context: async ({ req }: any) => {
      return { req };
    },
  });
  await server.start();
  server.applyMiddleware({
    app,
    cors: { credentials: true, origin: "*" },
    path: "/graphql",
  });
})();

export default app;
