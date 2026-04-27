import jwt from "@elysia/jwt";
import Elysia from "elysia";
import { ApiKeysService } from "./service";
import { ApiKeysModel } from "./model";

export const ApiKeysApp = new Elysia({ prefix: "/api-keys" })

  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "Fischl von Luftschloss Narfidort",
    }),
  )
  .resolve(async ({ cookie: { auth }, status, jwt }) => {
    if (!auth) return status(401);
    const decoded = await jwt.verify(auth.value as string);
    if (!decoded || !decoded.userId) return status(401);
    return { userId: decoded.userId as string };
  })

  .post(
    "/",
    async ({ userId, status, body }) => {
      try {
        const { apiKey, id } = await ApiKeysService.createApiKey(
          body.name,
          userId,
        );

        return status(200, { id, apiKey });
      } catch (e) {
        console.error(e);
        return status(400, {
          message: "Failed to create api key",
        });
      }
    },
    {
      body: ApiKeysModel.createApiKeyBody,
      response: {
        200: ApiKeysModel.createApiKeyRespone,
        400: ApiKeysModel.createApiKeyFailure,
      },
    },
  )

  .get(
    "/",
    async ({ status, userId }) => {
      try {
        const apiKeys = await ApiKeysService.getApiKeys(userId);
        return status(200, { apiKeys });
      } catch (e) {
        console.error(e);
        return status(400, {
          message: "Failed to fetch api keys",
        });
      }
    },
    {
      response: {
        200: ApiKeysModel.getApiKeysResponse,
        400: ApiKeysModel.getApiKeysFailure,
      },
    },
  )

  .put(
    "/:id",
    async ({ params: { id }, status, userId, body }) => {
      try {
        await ApiKeysService.updateApiKey(id, userId, body.disabled);
        return status(200, { message: "Updated api key successfully" });
      } catch (e) {
        console.error(e);
        return status(400, { message: "Updating api key failed" });
      }
    },
    {
      body: ApiKeysModel.updateApiKeyBody,
      response: {
        200: ApiKeysModel.updateApiKeyResponse,
        400: ApiKeysModel.updateApiKeyFailure,
      },
    },
  )

  .delete(
    "/:id",
    async ({ userId, params: { id }, status }) => {
      try {
        await ApiKeysService.deleteApiKey(userId, id);
        return status(200, { message: "Deleted api key successfully" });
      } catch (e) {
        console.error(e);
        return status(400, { message: "Deleting api key failed" });
      }
    },
    {
      response: {
        200: ApiKeysModel.delelteApiKeyResponse,
        400: ApiKeysModel.delelteApiKeyFailure,
      },
    },
  );
