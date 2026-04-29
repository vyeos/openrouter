import { GoogleGenAI } from "@google/genai";
import { LlmResponse, Messages } from "../types";
import { BaseLlm } from "./Base";

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export class Gemini extends BaseLlm {
  static async chat(model: string, messages: Messages): Promise<LlmResponse> {
    const response = await client.models.generateContent({
      contents: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      model: model,
    });

    return {
      outputTokensConsumed: response.usageMetadata?.candidatesTokenCount!,
      inputTokensConsumed: response.usageMetadata?.promptTokenCount!,
      completions: {
        choices: [
          {
            message: { content: response.text! },
          },
        ],
      },
    };
  }
}
