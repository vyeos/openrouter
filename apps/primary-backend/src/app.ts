import Elysia from "elysia";

export const app = new Elysia().get("/", "ehllo from elysia");

export type App = typeof app;
