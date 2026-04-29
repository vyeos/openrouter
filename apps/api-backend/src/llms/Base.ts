import { LlmResponse, Messages } from "../types";

export class BaseLlm {
  static async chat(model: string, message: Messages): Promise<LlmResponse> {
    throw new Error("Base llm function");
  }
}
