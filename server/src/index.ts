import app from "./Utils/server";
import "colors";

const PORT = process.env.PORT || 4000;

app.listen(PORT, (): void =>
  console.log(
    `GraphQL is now running on http://localhost:${PORT}/graphql`.magenta.italic
  )
);
