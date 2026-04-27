import { t, UnwrapSchema } from "elysia";

export const ModelsModel = {
  getModelsResponse: t.Object({
    models: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
        slug: t.String(),
        company: t.Object({
          id: t.String(),
          name: t.String(),
          website: t.String(),
        }),
      }),
    ),
  }),
  getModelsFailure: t.Object({
    message: t.Literal("Failed to fetch models"),
  }),
  getProvidersResponse: t.Object({
    providers: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
        website: t.String(),
      }),
    ),
  }),
  getProvidersFailure: t.Object({
    message: t.Literal("Failed to fetch providers"),
  }),
  getModelProvidersResponse: t.Object({
    providers: t.Array(
      t.Object({
        id: t.String(),
        providerId: t.String(),
        providerName: t.String(),
        providerWebsite: t.String(),
        inputTokenCost: t.Number(),
        outputTokenCost: t.Number(),
      }),
    ),
  }),
  getModelProvidersFailure: t.Object({
    message: t.Literal("Failed to fetch model provider"),
  }),
};

export type ModelsModel = {
  [k in keyof typeof ModelsModel]: UnwrapSchema<(typeof ModelsModel)[k]>;
};
