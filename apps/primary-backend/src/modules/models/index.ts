import Elysia from "elysia";
import { ModelsModel } from "./model";
import { ModelsService } from "./service";

export const ModelsApp = new Elysia({ prefix: "/models" })
  .get(
    "/",
    async ({ status }) => {
      try {
        const models = await ModelsService.getModels();
        return status(200, { models });
      } catch (e) {
        console.error(e);
        return status(400, {
          message: "Failed to fetch models",
        });
      }
    },
    {
      response: {
        200: ModelsModel.getModelsResponse,
        400: ModelsModel.getModelsFailure,
      },
    },
  )

  .get(
    "/providers",
    async ({ status }) => {
      try {
        const providers = await ModelsService.getProviders();
        return status(200, { providers });
      } catch (e) {
        console.error(e);
        return status(400, {
          message: "Failed to fetch providers",
        });
      }
    },
    {
      response: {
        200: ModelsModel.getProvidersResponse,
        400: ModelsModel.getProvidersFailure,
      },
    },
  )

  .get(
    "/:id/providers",
    async ({ params: { id }, status }) => {
      try {
        const providers = await ModelsService.getModelProviders(id);
        return status(200, { providers });
      } catch (e) {
        console.error(e);
        return status(400, {
          message: "Failed to fetch model provider",
        });
      }
    },
    {
      response: {
        200: ModelsModel.getModelProvidersResponse,
        400: ModelsModel.getModelProvidersFailure,
      },
    },
  );
