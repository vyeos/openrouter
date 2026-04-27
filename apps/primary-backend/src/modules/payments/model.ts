import { t, UnwrapSchema } from "elysia";

export const PaymentsModel = {
  onrampResponse: t.Object({
    message: t.Literal("Onramp successful"),
    credits: t.Number(),
  }),
  onrampFailure: t.Object({
    message: t.Literal("Onramp failed"),
  }),
};

export type ModelsModel = {
  [k in keyof typeof PaymentsModel]: UnwrapSchema<(typeof PaymentsModel)[k]>;
};
