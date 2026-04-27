import Elysia from "elysia";
import { AuthApp } from "./modules/auth";
import { ApiKeysApp } from "./modules/apiKeys";
import { ModelsApp } from "./modules/models";

export const app = new Elysia()
  .get("/", "hello from elysia")
  .use(AuthApp)
  .use(ApiKeysApp)
  .use(ModelsApp);

export type App = typeof app;
