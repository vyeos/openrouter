import { Elysia } from "elysia";
import bearer from "@elysia/bearer";
import { Conversation, LlmResponse } from "./types";
import { db } from "db";

const app = new Elysia()
  .use(bearer())
  //.use(openapi());
  .post(
    "/api/v1/chat/completions",
    async ({ status, bearer: apiKey, body }) => {
      const model = body.model;
      const [_, providerModelName] = model.split("/");
      const apiKeyDb = await db.apiKey.findFirst({
        where: {
          apiKey,
          disabled: false,
          deleted: false,
        },
        select: {
          user: true,
        },
      });

      if (!apiKeyDb)
        return status(403, {
          message: "Invalid api key",
        });

      if (apiKeyDb?.user.credits <= 0) {
        return status(403, {
          message: "You don't have enough credits for this api key",
        });
      }
      const modelDb = await db.model.findFirst({
        where: {
          slug: model,
        },
      });

      if (!modelDb) return status(403, { message: "Invalid model name" });

      const providerDb = await db.modelProviderMapping.findMany({
        where: { modelId: modelDb.id },
        include: {
          provider: true,
        },
      });

      const provider =
        providerDb[Math.floor(Math.random() * providerDb.length)];

      let response: LlmResponse | null = null;
    },

    { body: Conversation },
  )
  .listen(4000);
