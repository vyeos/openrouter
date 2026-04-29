import { t } from "elysia";

export const Messages = t.Array(
  t.Object({
    role: t.Enum({
      user: "user",
      assitant: "assistant",
    }),
    content: t.String(),
  }),
);

export type Messages = typeof Messages.static;

export const Conversation = t.Object({
  model: t.String(),
  messages: Messages,
});

export type LlmResponse = {
  completions: {
    choices: {
      message: {
        content: string;
      };
    }[];
  };
  outputTokensConsumed: number;
  inputTokensConsumed: number;
};
