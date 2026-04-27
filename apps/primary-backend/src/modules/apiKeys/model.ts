import { t, UnwrapSchema } from "elysia";

export const ApiKeysModel = {
  createApiKeyBody: t.Object({
    name: t.String(),
  }),
  createApiKeyRespone: t.Object({
    id: t.String(),
    apiKey: t.String(),
  }),
  createApiKeyFailure: t.Object({
    message: t.Literal("Failed to create api key"),
  }),
  getApiKeysResponse: t.Object({
    apiKeys: t.Array(
      t.Object({
        id: t.String(),
        apiKey: t.String(),
        name: t.String(),
        creditsConsumed: t.Number(),
        lastUsed: t.Nullable(t.Date()),
        disabled: t.Boolean(),
      }),
    ),
  }),
  getApiKeysFailure: t.Object({
    message: t.Literal("Failed to fetch api keys"),
  }),
  updateApiKeyBody: t.Object({
    id: t.String(),
    disabled: t.Boolean(),
  }),
  updateApiKeyResponse: t.Object({
    message: t.Literal("Updated api key successfully"),
  }),
  updateApiKeyFailure: t.Object({
    message: t.Literal("Updating api key failed"),
  }),
  delelteApiKeyResponse: t.Object({
    message: t.Literal("Deleted api key successfully"),
  }),
  delelteApiKeyFailure: t.Object({
    message: t.Literal("Deleting api key failed"),
  }),
};

export type ApiKeysModel = {
  [k in keyof typeof ApiKeysModel]: UnwrapSchema<(typeof ApiKeysModel)[k]>;
};
