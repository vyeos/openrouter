import OpenAI from "openai";
import { LlmResponse, Messages } from "../types";
import { BaseLlm } from "./Base";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAi extends BaseLlm {
  static async chat(model: string, messages: Messages): Promise<LlmResponse> {
    const response = await client.responses.create({
      input: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      model: model,
    });

    return {
      outputTokensConsumed: response.usage?.output_tokens!,
      inputTokensConsumed: response.usage?.input_tokens!,
      completions: {
        choices: [
          {
            message: { content: response.output_text },
          },
        ],
      },
    };
  }
}
