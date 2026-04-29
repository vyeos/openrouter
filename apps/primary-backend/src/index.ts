import { app } from "./app";
import { cors } from "@elysiajs/cors";

app
  .use(
    cors({
      origin: "http://localhost:3001",
      credentials: true,
    }),
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
