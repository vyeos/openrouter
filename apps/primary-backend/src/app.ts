import Elysia from "elysia";
import { AuthApp } from "./modules/auth";

export const app = new Elysia().get("/", "ehllo from elysia").use(AuthApp);

export type App = typeof app;
