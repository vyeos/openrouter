import { Elysia } from "elysia";
import bearer from "@elysia/bearer";
import { Conversation, LlmResponse } from "./types";
import { db } from "db";
import { Gemini } from "./llms/Gemini";
import { Claude } from "./llms/Claude";
import { OpenAi } from "./llms/Openai";

const app = new Elysia()
  .use(bearer())
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
        providerDb[Math.floor(Math.random() * providerDb.length)].provider;

      let response: LlmResponse | null = null;

      if (provider.name == "Google")
        response = await Gemini.chat(providerModelName, body.messages);
      else if (provider.name == "Claude")
        response = await Claude.chat(providerModelName, body.messages);
      else if (provider.name == "OpenAI")
        response = await OpenAi.chat(providerModelName, body.messages);

      if (!response)
        return status(403, { message: "No provider found for this model" });

      const creditsUsed =
        (response.inputTokensConsumed * provider.inputTokenCost +
          response.outputTokensConsumed * provider.outputTokenCost) /
        10;
      console.log(creditsUsed);
      const res = await db.user.update({
        where: {
          id: apiKeyDb.user.id,
        },
        data: {
          credits: {
            decrement: creditsUsed,
          },
        },
      });
      console.log(res);
      const res2 = await db.apiKey.update({
        where: {
          apiKey: apiKey,
        },
        data: {
          creditsConsumed: {
            increment: creditsUsed,
          },
        },
      });
      console.log(res2);

      return response;
    },

    { body: Conversation },
  )
  .listen(4000);
