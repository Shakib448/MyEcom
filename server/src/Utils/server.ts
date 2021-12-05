import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import compression from "compression";
import express from "express";
import http from "http";

import schema from "../schemas/Schema";
import { connectDB } from "../config/db";

dotenv.config();

const app = express();
app.use(compression());
connectDB().catch((err) => console.log(err));

(async () => {
  const server = new ApolloServer({
    schema,
    context: async ({ req, res }: any) => ({ req, res }),
  });
  await server.start();
  server.applyMiddleware({
    app,
    cors: { credentials: true, origin: "*" },
    path: "/graphql",
  });
})();

export default app;
