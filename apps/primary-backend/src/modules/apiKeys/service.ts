import { db } from "db";

const API_KEY_LENGTH = 20;
const ALPHABET_SET = "zxcvbnmasdfghjklqwertyuiop1234567890";

export abstract class ApiKeysService {
  static createRandomApiKey() {
    let suffixKey = "";
    for (let i = 0; i < API_KEY_LENGTH; i++) {
      suffixKey +=
        ALPHABET_SET[Math.floor(Math.random() * ALPHABET_SET.length)];
    }
    return `sk-or-v1-${suffixKey}`;
  }

  static async createApiKey(
    name: string,
    userId: string,
  ): Promise<{ id: string; apiKey: string }> {
    const apiKey = ApiKeysService.createRandomApiKey();
    const apiKeyDb = await db.apiKey.create({
      data: {
        userId,
        name,
        apiKey,
      },
    });
    return { id: apiKeyDb.id, apiKey };
  }

  static async getApiKeys(userId: string) {
    const apiKeys = await db.apiKey.findMany({
      where: { userId, deleted: false },
    });
    return apiKeys.map((apiKey) => ({
      id: apiKey.id,
      apiKey: apiKey.apiKey,
      name: apiKey.name,
      creditsConsumed: apiKey.creditsConsumed,
      lastUsed: apiKey.lastUsed,
      disabled: apiKey.disabled,
    }));
  }

  static async updateApiKey(
    apiKeyId: string,
    userId: string,
    disabled: boolean,
  ) {
    await db.apiKey.update({
      where: {
        id: apiKeyId,
        userId,
      },
      data: {
        disabled,
      },
    });
  }

  static async deleteApiKey(userId: string, apiKeyId: string) {
    await db.apiKey.update({
      where: {
        id: apiKeyId,
        userId,
      },
      data: {
        deleted: true,
      },
    });
  }
}
