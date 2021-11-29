import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import compression from "compression";
import schema from "../schemas/Schema";
import express from "express";
import { connectDB } from "../config/db";

const app = express();
app.use(compression());
connectDB().catch((err) => console.log(err));

(async () => {
  const server = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
  });
  await server.start();
  server.applyMiddleware({
    app,
    cors: { credentials: true, origin: "*" },
    path: "/graphql",
  });
})();

export default app;
