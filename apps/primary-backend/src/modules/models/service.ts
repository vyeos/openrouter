import { db } from "db";

export abstract class ModelsService {
  static async getModels() {
    const models = await db.model.findMany({
      include: { company: true },
    });
    return models.map((model) => ({
      id: model.id,
      name: model.name,
      slug: model.slug,
      company: {
        id: model.company.id,
        name: model.company.name,
        website: model.company.website,
      },
    }));
  }

  static async getProviders() {
    const providers = await db.provider.findMany();
    return providers.map((provider) => ({
      id: provider.id,
      name: provider.name,
      website: provider.website,
    }));
  }

  static async getModelProviders(modelId: string) {
    const mappings = await db.modelProviderMapping.findMany({
      where: { modelId },
      include: { provider: true },
    });
    return mappings.map((mapping) => ({
      id: mapping.id,
      providerId: mapping.provider.id,
      providerName: mapping.provider.name,
      providerWebsite: mapping.provider.website,
      inputTokenCost: mapping.inputTokenCost,
      outputTokenCost: mapping.outputTokenCost,
    }));
  }
}
