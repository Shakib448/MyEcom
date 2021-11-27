import { createServer, Server } from "http";
import app from "./Utils/server";

const PORT = process.env.PORT || 4000;

const httpServer: Server = createServer(app);

httpServer.listen({ port: PORT }, (): void =>
  console.log(`\n🚀GraphQL is now running on http://localhost:${PORT}/graphql`)
);
